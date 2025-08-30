import { backendURL } from "../../config/config";
import { useCallback, useState, useRef, useEffect, useMemo } from "react";
import type { Service } from "../../types/service";
import type { AppError } from "../../types/app-error";
import type { SortState, QueryState, Result } from "./useGetAllServices.types";
import { useDebouncedValue } from "../useDebouncedValue";

const DEFAULT_PAGE_SIZE = 10;

const useGetAllServices = (): Result => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const [total, setTotal] = useState(0);

  const [query, setQuery] = useState<QueryState>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    search: "",
    status: null,
    sort: {}
  });

  const { debounced: debouncedSearch } = useDebouncedValue(query.search, 350);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setQuery((q) => ({ ...q, page: 1 }));
  }, [debouncedSearch, query.status]);

  const qs = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(query.page));
    params.set("pageSize", String(query.pageSize));

    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (query.status && query.status !== "all") params.set("status", query.status);

    if (query.sort.field && query.sort.order) {
      const dir = query.sort.order === "ascend" ? "asc" : "desc";
      params.set("sort", `${query.sort.field}:${dir}`);
    }

    return params.toString();
  }, [query.page, query.pageSize, debouncedSearch, query.status, query.sort.field, query.sort.order]);
  
  const doFetch = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const url = `${backendURL}/api/services${qs ? `?${qs}` : ""}`;
      const res = await fetch(url, { signal: controller.signal });

      if (!res.ok) throw new Error(`Request failed with ${res.status}`);

      let totalCount = Number(res.headers.get("X-Total-Count") ?? "0");
      const body = await res.json();
      
      if (Array.isArray(body)) {
        setServices(body);
        setTotal(totalCount || body.length);
      } else if ("items" in body) {
        setServices(body.items as Service[]);
        setTotal(Number(body.total ?? (body.items?.length ?? 0)));
      } else {
        // Unknown shape: still try to show something helpful
        const maybeItems = (body?.data ?? body?.results ?? []) as Service[];
        setServices(Array.isArray(maybeItems) ? maybeItems : []);
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
      sort: {},
    }));
  }, []);

  const refetch = useCallback(async () => {
    await doFetch();
  }, [doFetch]);

  return {
    services,
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

    sort: query.sort,
    setSort,

    refetch,
    resetFilters
  };
}

export default useGetAllServices;