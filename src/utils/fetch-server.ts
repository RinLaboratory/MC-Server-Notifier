import mcutil from "minecraft-server-util";
import type { TServer } from "./validators";
import ServerMessage from "./messages";
import fetchDiscord from "./fetch-discord";

let lastOnlineStatus = false;
let lastErrorStatus = false;

export async function FetchServer(server: TServer) {
  try {
    const response = await mcutil.status(
      server.config.serverIP,
      server.config.serverPort,
      {
        timeout: 500,
      }
    );

    if (!lastOnlineStatus) {
      await fetchDiscord({
        message: ServerMessage({
          title: " #️⃣ Atención",
          color: 15258703,
          server,
          serverStatus: "online",
        }),
        serverResponse: response,
        serverName: server.name,
      });
      lastErrorStatus = false;
    }

    lastOnlineStatus = true;
  } catch (error) {
    if (error instanceof Error) {
      if (!lastErrorStatus) {
        if (
          error.message === "Server is offline or unreachable" ||
          `connect ECONNREFUSED ${server.config.serverIP}:${server.config.serverPort}`
        ) {
          await fetchDiscord({
            message: ServerMessage({
              title: " ⚠️ Atención",
              color: 16724541,
              server,
              serverStatus: "offline",
            }),
            serverName: server.name,
            serverResponse: {
              version: { name: "Unknown - Offline", protocol: 0 },
            },
          });

          lastOnlineStatus = false;
          lastErrorStatus = true;
        } else if (
          error.message === "Socket closed unexpectedly while waiting for data"
        ) {
          console.warn(`Server ["${server.name}"]: ${error.message}`);
        } else {
          await fetchDiscord({
            message: ServerMessage({
              title: " ❌ Error",
              color: 255,
              server,
              serverStatus: "unknown",
            }),
            serverName: server.name,
            serverResponse: {
              version: { name: "Unknown - Error", protocol: 0 },
            },
          });

          console.error(
            `Server ["${server.name}"]: Ocurrió un error inesperado. traceback:`,
            error.cause
          );
          lastErrorStatus = true;
        }
      }
    }
  }
}
