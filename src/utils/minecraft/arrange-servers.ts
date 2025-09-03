import type { TServer, TServerResponse } from "@validators";
import type { APIEmbedField } from "discord.js";
import type { JavaStatusLegacyResponse } from "minecraft-server-util";
import { clientStore, messageStore } from "@store";
import { getMachineStatus, httpStatus } from "@utils/machine";
import { logger } from "@utils/services";
import { t } from "@utils/translations";
import { groupServers } from "./group-servers";
import serverStatus from "./server-status";

interface HandleServerStatusProps {
  server: TServer;
  serverResponse: Partial<JavaStatusLegacyResponse>;
  arrangedServers: APIEmbedField[][];
}

async function handleServerStatus({
  arrangedServers,
  server,
  serverResponse,
}: HandleServerStatusProps) {
  const ServerInfo = await serverStatus({
    server,
    serverResponse,
  });

  const { memorizedLastMentionTimestamp, hideServersURLs } =
    messageStore.getState();
  const lastMentionedServer = memorizedLastMentionTimestamp.find(
    (value) => value.serverName === server.name,
  );

  const placeholder_options = {
    server_name: server.name,
    server_status: ServerInfo,
    server_runtime: serverResponse.version?.name ?? "",
    server_url: hideServersURLs
      ? t("commands.toggle-servers-urls.hidden")
      : server.config.serverURL,
    server_ip: server.config.serverIP,
    server_port: server.config.serverPort,
    version_protocol: serverResponse.version?.protocol ?? 0,
    player_count: serverResponse.players?.online ?? 0,
    max_player_count: serverResponse.players?.max ?? 0,
    last_available: lastMentionedServer
      ? `<t:${lastMentionedServer.timestamp}:R>`
      : t("server.last-fetch.never"),
  };

  arrangedServers.push([
    {
      name: t("server.first-column.top", placeholder_options),
      value: t("server.first-column.bottom", placeholder_options),
      inline: true,
    },
    {
      name: t("server.middle-column.top", placeholder_options),
      value: t("server.middle-column.bottom", placeholder_options),
      inline: true,
    },
    {
      name: t("server.last-column.top", placeholder_options),
      value: t("server.last-column.bottom", placeholder_options),
      inline: true,
    },
  ]);
}

interface UpdateArrangementProps {
  serverResponse: TServerResponse[];
}

export async function arrangeServers({
  serverResponse,
}: UpdateArrangementProps) {
  const { client } = clientStore.getState();
  const arrangedServers: APIEmbedField[][] = [];

  if (!client) {
    return logger.fatal("client has not been initialized");
  }

  for (const { server, response } of serverResponse) {
    if (server.type === "machine") {
      const ServerInfo = await getMachineStatus({
        server,
      });
      arrangedServers.push(ServerInfo);
    } else if (server.type === "http") {
      const httpServerResponse = await httpStatus(server);
      await handleServerStatus({
        server,
        arrangedServers,
        serverResponse: httpServerResponse,
      });
    } else {
      await handleServerStatus({
        server,
        arrangedServers,
        serverResponse: response,
      });
    }
  }
  return groupServers(arrangedServers);
}
