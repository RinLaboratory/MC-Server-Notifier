import mcutil from "minecraft-server-util";
import type { TServer, TServerResponse } from "./validators";
import logger from "./logger";

export async function fetchServer(server: TServer): Promise<TServerResponse> {
  try {
    const response = await mcutil.status(
      server.config.serverIP,
      server.config.serverPort,
      {
        timeout: 500,
      },
    );

    return {
      response,
      server,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "Server is offline or unreachable" ||
        `connect ECONNREFUSED ${server.config.serverIP}:${server.config.serverPort}`
      ) {
        return {
          server,
          response: {
            version: { name: "Unknown - Offline", protocol: 0 },
          },
        };
      } else if (
        error.message === "Socket closed unexpectedly while waiting for data"
      ) {
        logger.warn(`Server ["${server.name}"]: ${error.message}`);
      } else {
        logger.error(
          `Server ["${server.name}"]: Ocurrió un error inesperado. traceback:`,
          error.cause,
        );
      }
    }
    return {
      server,
      response: {
        version: { name: "Unknown - Error", protocol: 0 },
      },
    };
  }
}
