import { env } from "~/env";

function log(message: string) {
  if (env.NODE_ENV === "development") {
    console.log(message);
  }
}

function warn(message: string) {
  if (env.NODE_ENV === "development") {
    console.warn(message);
  }
}

function error(message: string, error?: unknown) {
  if (env.NODE_ENV === "development") {
    if (error instanceof Error) {
      console.error(message, error.cause);
    } else {
      console.error(message);
    }
  }
}

function fatal(message: string): never {
  console.error(message);
  throw new Error(message);
}

export const logger = { log, warn, error, fatal };
