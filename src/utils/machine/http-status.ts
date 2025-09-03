import type { TServer } from "@validators";
import type { JavaStatusLegacyResponse } from "minecraft-server-util";
import * as http from "@utils/http";

export async function httpStatus(
  server: TServer,
): Promise<Partial<JavaStatusLegacyResponse>> {
  try {
    const response = await http.get<{ uptime: number }>(
      `http://${server.config.serverIP}:${server.config.serverPort}/healthcheck`,
    );

    return {
      version: { name: `Online active ${response.uptime}`, protocol: 0 },
    };
  } catch {
    return {
      version: { name: "Unknown - Offline", protocol: 0 },
    };
  }
}
