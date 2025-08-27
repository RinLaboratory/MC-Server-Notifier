/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ServiceResult } from "@validators";
import { ZodError } from "zod";
import { env } from "~/env";
import { InternalServiceError, ServiceErrorCode } from "./errors";

const isLoggingEnabled = env.NODE_ENV === "development";

type AsyncMethod<T = any> = (...args: any[]) => Promise<T>;

export type ServiceClass<T> = {
  [K in keyof T]: T[K] extends AsyncMethod<infer R>
    ? AsyncMethod<ServiceResult<R>>
    : T[K];
};

export function service() {
  return function decorateClass<T extends new (...args: any[]) => object>(
    target: T,
  ): T &
    (new (...args: ConstructorParameters<T>) => ServiceClass<InstanceType<T>>) {
    const targetProto = target.prototype;
    const methods = Object.getOwnPropertyNames(targetProto);

    // Wrap each method on the target prototype
    methods.forEach((method) => {
      if (method !== "constructor" && !method.startsWith("_")) {
        const descriptor = Object.getOwnPropertyDescriptor(targetProto, method);
        if (descriptor && typeof descriptor.value === "function") {
          const originalMethod = descriptor.value;

          targetProto[method] = async function wrapped(...args: any[]) {
            try {
              const result = await originalMethod.apply(this, args);
              return result;
            } catch (error) {
              return handleErrors(error);
            }
          };
        }
      }
    });

    // Return the decorated class
    return class extends target {
      constructor(...args: any[]) {
        super(...args);
      }
    } as any;
  };
}

function handleErrors(error: unknown): ServiceResult<never> {
  if (isLoggingEnabled) {
    console.error(error);
  }

  // Internal Service Errors
  if (error instanceof InternalServiceError) {
    return {
      success: false,
      error: error.toServiceError(),
    };
  }

  // Zod Validation Errors
  if (error instanceof ZodError) {
    return {
      success: false,
      error: {
        code: ServiceErrorCode.VALIDATION_ERROR,
        message: `Validation failed - ${formatZodError(error)[0]?.message}`,
        details: {
          validationErrors: formatZodError(error),
        },
      },
    };
  }

  // Default error handler
  return {
    success: false,
    error: {
      code: ServiceErrorCode.SOMETHING_WENT_WRONG,
      message: "An unexpected error occurred",
      details: {
        error: error instanceof Error ? error.message : String(error),
      },
    },
  };
}

function formatZodError(error: ZodError) {
  return error.errors.map((err) => ({
    path: err.path.join("."),
    message: err.message,
    code: err.code,
  }));
}
