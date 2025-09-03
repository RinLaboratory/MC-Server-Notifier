export enum ServiceErrorCode {
  // generic error
  NOT_IMPLEMENTED = "NOT_IMPLEMENTED",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  SOMETHING_WENT_WRONG = "SOMETHING_WENT_WRONG",
}

export interface ServiceError {
  code: ServiceErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

export class InternalServiceError extends Error {
  public readonly code: ServiceErrorCode;
  public readonly details?: Record<string, unknown>;

  constructor({ code, message, details }: ServiceError) {
    super(message);
    this.name = "InternalServiceError";
    this.code = code;
    this.details = details;
  }

  toServiceError(): ServiceError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}
