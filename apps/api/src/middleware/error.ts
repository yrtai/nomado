import type { NextFunction, Request, Response } from "express";

/**
 * Error responses follow RFC 7807 (problem+json):
 * { type, title, status, detail } — one consistent error shape everywhere.
 */
export class HttpError extends Error {
  constructor(
    public status: number,
    public title: string,
    public detail?: string
  ) {
    super(detail ?? title);
  }
}

export function notFoundHandler(req: Request, res: Response) {
  res
    .status(404)
    .type("application/problem+json")
    .json({
      type: "about:blank",
      title: "Not Found",
      status: 404,
      detail: `No route for ${req.method} ${req.path}`,
    });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err instanceof HttpError ? err.status : 500;
  const title = err instanceof HttpError ? err.title : "Internal Server Error";
  const detail =
    err instanceof HttpError
      ? err.detail
      : err instanceof Error && process.env.NODE_ENV !== "production"
        ? err.message
        : undefined;

  if (status >= 500) console.error(err);

  res
    .status(status)
    .type("application/problem+json")
    .json({ type: "about:blank", title, status, detail });
}
