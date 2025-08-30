import type { Service } from "../../types/service";
import type { AppError } from "../../types/app-error";

export type SortOrder = "ascend" | "descend" | undefined;

export type SortState = {
  field?: string;
  order?: SortOrder;
};

export type QueryState = {
  page: number;
  pageSize: number;
  search: string;
  status?: string | null;
  sort: SortState;
};

export type Result = {
  services: Service[];
  loading: boolean;
  error: AppError | null;

  // pagination
  page: number;
  pageSize: number;
  total: number;

  // filters
  search: string;
  setSearch: (s: string) => void;
  status: string | null | undefined;
  setStatus: (s: string | null | undefined) => void;

  // sorting
  sort: SortState;
  setSort: (s: SortState) => void;

  // page controls
  setPage: (p: number) => void;
  setPageSize: (ps: number) => void;

  refetch: () => Promise<void>;
  resetFilters: () => void;
};