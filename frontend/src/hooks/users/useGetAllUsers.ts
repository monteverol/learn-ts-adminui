import { useState, useRef, useCallback, useEffect } from "react"
import { backendURL } from "../../config/config";

interface Tag {
  id: string;
  name: string;
}

interface Responsibility {
  id: string;
  title: string;
  workExperienceId: string;
}

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  responsibilities: Responsibility[];
}

interface User {
  id: string;
  name: string;
  age?: number;
  address?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  jobTitle?: string;
  jobCategory?: 'MAINTENANCE' | 'OPERATIONS' | 'OTHER';
  yearsExperience?: number;
  bio?: string;
  description?: string;
  tags: Tag[];
  workExperience: WorkExperience[];
  createdAt: string;
  updatedAt: string;
}

interface Filter {
  search: string;
  status: string;
  category: string;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
}

const useGetAllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState< string | null >(null);

  const [filter, setFilter] = useState<Filter>({ search: "", status: "", category: "" });
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10, total: 0 });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const buildQuery = useCallback((f: Filter, m: Meta) => {
    const params = new URLSearchParams();
    if (f.search.trim()) params.set("search", f.search.trim());
    if (f.status)       params.set("status", f.status);
    if (f.category)     params.set("category", f.category);
    params.set("page", String(m.page));
    params.set("limit", String(m.limit));
    return params.toString();
  }, []);

  const fetchUsers = useCallback(async (currentFilter: Filter, currentMeta: Meta, signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const qs = buildQuery(currentFilter, currentMeta);
      const res = await fetch(`${backendURL}/api/users?${qs}`, { signal });

      if (!res.ok) {
        // Handle error response - read response body only once
        let message = `Request failed (${res.status})`;
        const contentType = res.headers.get('content-type');
        
        if (contentType?.includes('application/json')) {
          try {
            const errJson = await res.json();
            message = errJson?.message ?? message;
          } catch {
            message = `Request failed (${res.status})`;
          }
        } else {
          try {
            const txt = await res.text();
            if (txt) message = txt;
          } catch {
            message = `Request failed (${res.status})`;
          }
        }
        throw new Error(message);
      }

      const json = await res.json();
      if (Array.isArray(json)) {
        setUsers(json);
      } else {
        setUsers(json.data ?? []);
        setMeta((prev) => ({
          ...prev,
          ...json.meta,
          page: json.meta?.page ?? prev.page,
          limit: json.meta?.limit ?? prev.limit,
          total: json.meta?.total ?? prev.total,
        }));
      }
    } catch (e) {
      if ((e as any)?.name === "AbortError") return;
      setError(e instanceof Error ? e.message : String(e));
      console.error("useGetAllUsers error:", e);
    } finally {
      setLoading(false);
    }
  }, [buildQuery]);

  const triggerFetch = useCallback(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    void fetchUsers(filter, meta, controller.signal);
  }, [fetchUsers, filter, meta]);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    void fetchUsers(filter, meta, controller.signal);
    return () => abortRef.current?.abort();
  }, [fetchUsers, filter.status, filter.category, meta.page, meta.limit]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const newFilter = { ...filter };
      const newMeta = { ...meta, page: 1 };
      setMeta(newMeta);
      
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      void fetchUsers(newFilter, newMeta, controller.signal);
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.search, fetchUsers]);

  const updateFilter = useCallback(
    (patch: Partial<Filter>) =>
      setFilter((prev) => ({ ...prev, ...patch })),
    []
  );

  const setPage = useCallback((page: number) => {
    setMeta((prev) => ({ ...prev, page: Math.max(1, page) }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setMeta((prev) => ({ ...prev, limit: Math.max(1, limit), page: 1 }));
  }, []);

  const refetch = useCallback(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    void fetchUsers(filter, meta, controller.signal);
  }, [fetchUsers, filter, meta]);

  return {
    users,
    loading,
    error,
    filter,
    updateFilter,
    setFilter,
    meta,
    setMeta,
    setPage,
    setLimit,
    refetch,
  };
}

export default useGetAllUsers;