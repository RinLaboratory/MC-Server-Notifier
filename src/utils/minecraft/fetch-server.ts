import type { TServer, TServerResponse } from "@validators";
import { logger } from "@utils/services";
import mcutil from "minecraft-server-util";

const genericErrorResponses = (server: TServer) => {
  return {
    error: {
      server,
      response: {
        version: { name: "Unknown - Error", protocol: 0 },
      },
    },
    offline: {
      server,
      response: {
        version: { name: "Unknown - Offline", protocol: 0 },
      },
    },
  };
};

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
    const errorResponse = genericErrorResponses(server);

    if (!(error instanceof Error)) {
      return errorResponse.error;
    }

    if (
      error.message.includes("offline") ||
      error.message.includes("ECONNREFUSED")
    ) {
      return errorResponse.offline;
    }

    if (error.message.includes("Socket closed")) {
      logger.warn(`Server ["${server.name}"]: ${error.message}`);
      return errorResponse.error;
    }

    logger.error(
      `Server ["${server.name}"]: Throwed an unexpected error. traceback:`,
      error.cause,
    );
    return errorResponse.error;
  }
}
