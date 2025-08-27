export interface HttpError extends Error {
  status: number;
  statusText: string;
  data?: unknown;
}

export class FetchError extends Error implements HttpError {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown,
    message?: string,
  ) {
    super(
      message ??
        `Request failed (${status}): ${statusText}; ${typeof data === "string" ? data : ""}`,
    );
    this.name = "FetchError";
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}
