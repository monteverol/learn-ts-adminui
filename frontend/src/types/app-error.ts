export type AppError = { message: string; code?: string; cause?: unknown };

const toAppError = (err: unknown): AppError =>
  err instanceof Error
    ? { message: err.message, cause: err }
    : typeof err === "string"
      ? { message: err }
      : { message: "Unexpected error", cause: err };
