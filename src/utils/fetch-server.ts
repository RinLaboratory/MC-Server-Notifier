import mcutil from "minecraft-server-util";
import type { TServer, TServerResponse } from "./validators";

export async function FetchServer(server: TServer): Promise<TServerResponse> {
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
        console.warn(`Server ["${server.name}"]: ${error.message}`);
      } else {
        console.error(
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
