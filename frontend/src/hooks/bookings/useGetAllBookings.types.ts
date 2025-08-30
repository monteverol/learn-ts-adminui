import type { Booking } from "../../types/booking";
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
  serviceId?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  sort: SortState;
};

export type Result = {
  bookings: Booking[];
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
  serviceId: string | null | undefined;
  setServiceId: (s: string | null | undefined) => void;
  dateFrom: string | null | undefined;
  setDateFrom: (s: string | null | undefined) => void;
  dateTo: string | null | undefined;
  setDateTo: (s: string | null | undefined) => void;

  // sorting
  sort: SortState;
  setSort: (s: SortState) => void;

  // page controls
  setPage: (p: number) => void;
  setPageSize: (ps: number) => void;

  refetch: () => Promise<void>;
  resetFilters: () => void;
};