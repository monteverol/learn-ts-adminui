import { backendURL } from "../../config/config";
import { useCallback, useState, useRef, useEffect, useMemo } from "react";
import type { Booking } from "../../types/booking";
import type { AppError } from "../../types/app-error";
import type { SortState, QueryState, Result } from "./useGetAllBookings.types";
import { useDebouncedValue } from "../useDebouncedValue";

const DEFAULT_PAGE_SIZE = 10;

const useGetAllBookings = (): Result => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const [total, setTotal] = useState(0);

  const [query, setQuery] = useState<QueryState>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    search: "",
    status: null,
    serviceId: null,
    dateFrom: null,
    dateTo: null,
    sort: {}
  });

  const { debounced: debouncedSearch } = useDebouncedValue(query.search, 350);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setQuery((q) => ({ ...q, page: 1 }));
  }, [debouncedSearch, query.status, query.serviceId, query.dateFrom, query.dateTo]);

  const qs = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(query.page));
    params.set("pageSize", String(query.pageSize));

    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (query.status && query.status !== "all") params.set("status", query.status);
    if (query.serviceId) params.set("serviceId", query.serviceId);
    if (query.dateFrom) params.set("dateFrom", query.dateFrom);
    if (query.dateTo) params.set("dateTo", query.dateTo);

    if (query.sort.field && query.sort.order) {
      const dir = query.sort.order === "ascend" ? "asc" : "desc";
      params.set("sort", `${query.sort.field}:${dir}`);
    }

    return params.toString();
  }, [query.page, query.pageSize, debouncedSearch, query.status, query.serviceId, query.dateFrom, query.dateTo, query.sort.field, query.sort.order]);
  
  const doFetch = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const url = `${backendURL}/api/bookings${qs ? `?${qs}` : ""}`;
      const res = await fetch(url, { signal: controller.signal });

      if (!res.ok) throw new Error(`Request failed with ${res.status}`);

      let totalCount = Number(res.headers.get("X-Total-Count") ?? "0");
      const body = await res.json();
      
      if (Array.isArray(body)) {
        setBookings(body);
        setTotal(totalCount || body.length);
      } else if ("bookings" in body) {
        setBookings(body.bookings as Booking[]);
        setTotal(Number(body.pagination?.total ?? body.bookings?.length ?? 0));
      } else if ("items" in body) {
        setBookings(body.items as Booking[]);
        setTotal(Number(body.total ?? (body.items?.length ?? 0)));
      } else {
        // Unknown shape: still try to show something helpful
        const maybeItems = (body?.data ?? body?.results ?? []) as Booking[];
        setBookings(Array.isArray(maybeItems) ? maybeItems : []);
        setTotal(Number(body?.total ?? maybeItems?.length ?? 0));
      }
    } catch (e: unknown) {
      if ((e as any)?.name === "AbortError") return;
      
      const message = e instanceof Error ? e.message : String(e);
      setError({ message, cause: e });
    } finally {
      setLoading(false);
    }
  }, [qs]);

  useEffect(() => {
    void doFetch();
    return () => abortRef.current?.abort();
  }, [doFetch]);

  const setPage = useCallback((page: number) => {
    setQuery((q) => ({ ...q, page: Math.max(1, page) }));
  }, []);
  
  const setPageSize = useCallback((ps: number) => {
    setQuery((q) => ({ ...q, pageSize: ps, page: 1 }));
  }, []);

  const setSearch = useCallback((s: string) => {
    setQuery((q) => ({ ...q, search: s }));
  }, []);

  const setStatus = useCallback((s: string | null | undefined) => {
    setQuery((q) => ({ ...q, status: s ?? null }));
  }, []);

  const setServiceId = useCallback((s: string | null | undefined) => {
    setQuery((q) => ({ ...q, serviceId: s ?? null }));
  }, []);

  const setDateFrom = useCallback((s: string | null | undefined) => {
    setQuery((q) => ({ ...q, dateFrom: s ?? null }));
  }, []);

  const setDateTo = useCallback((s: string | null | undefined) => {
    setQuery((q) => ({ ...q, dateTo: s ?? null }));
  }, []);

  const setSort = useCallback((s: SortState) => {
    setQuery((q) => ({ ...q, sort: s }));
  }, []);

  const resetFilters = useCallback(() => {
    setQuery((q) => ({
      ...q,
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      search: "",
      status: null,
      serviceId: null,
      dateFrom: null,
      dateTo: null,
      sort: {},
    }));
  }, []);

  const refetch = useCallback(async () => {
    await doFetch();
  }, [doFetch]);

  return {
    bookings,
    loading,
    error,

    page: query.page,
    setPage,

    pageSize: query.pageSize,
    setPageSize,

    total,

    search: query.search,
    setSearch,

    status: query.status,
    setStatus,

    serviceId: query.serviceId,
    setServiceId,

    dateFrom: query.dateFrom,
    setDateFrom,

    dateTo: query.dateTo,
    setDateTo,

    sort: query.sort,
    setSort,

    refetch,
    resetFilters
  };
}

export default useGetAllBookings;