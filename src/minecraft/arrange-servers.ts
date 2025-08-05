import { getMachineStatus } from "~/machine/machine-status";
import type { TServerResponse } from "~/utils/validators";
import serverStatus from "./server-status";
import { messageStore } from "~/store/message-store";
import { groupServers } from "./group-servers";
import { clientStore } from "~/store/client-store";
import logger from "~/utils/logger";
import type { APIEmbedField } from "discord.js";
import { t } from "~/utils/translations";

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
    if (server.isMachine) {
      const ServerInfo = await getMachineStatus({
        server,
      });
      arrangedServers.push(ServerInfo);
    } else {
      const ServerInfo = await serverStatus({
        server,
        serverResponse: response,
      });

      const { memorizedLastMentionTimestamp } = messageStore.getState();
      const lastMentionedServer = memorizedLastMentionTimestamp.find(
        (value) => value.serverName === server.name,
      );

      arrangedServers.push([
        {
          name: t("server.first-column.top", {
            server_name: server.name,
            server_status: ServerInfo,
            server_runtime: response.version?.name ?? "",
            server_url: server.config.serverURL,
            server_ip: server.config.serverIP,
            server_port: server.config.serverPort,
            version_protocol: response.version?.protocol ?? 0,
            player_count: response.players?.online ?? 0,
            max_player_count: response.players?.max ?? 0,
            last_available: lastMentionedServer
              ? `<t:${lastMentionedServer.timestamp}:R>`
              : t("server.last-fetch.Nunca"),
          }),
          value: t("server.first-column.bottom", {
            server_name: server.name,
            server_status: ServerInfo,
            server_runtime: response.version?.name ?? "",
            server_url: server.config.serverURL,
            server_ip: server.config.serverIP,
            server_port: server.config.serverPort,
            version_protocol: response.version?.protocol ?? 0,
            player_count: response.players?.online ?? 0,
            max_player_count: response.players?.max ?? 0,
            last_available: lastMentionedServer
              ? `<t:${lastMentionedServer.timestamp}:R>`
              : t("server.last-fetch.Nunca"),
          }),
          inline: true,
        },
        {
          name: t("server.middle-column.top", {
            server_name: server.name,
            server_status: ServerInfo,
            server_runtime: response.version?.name ?? "",
            server_url: server.config.serverURL,
            server_ip: server.config.serverIP,
            server_port: server.config.serverPort,
            version_protocol: response.version?.protocol ?? 0,
            player_count: response.players?.online ?? 0,
            max_player_count: response.players?.max ?? 0,
            last_available: lastMentionedServer
              ? `<t:${lastMentionedServer.timestamp}:R>`
              : t("server.last-fetch.Nunca"),
          }),
          value: t("server.middle-column.bottom", {
            server_name: server.name,
            server_status: ServerInfo,
            server_runtime: response.version?.name ?? "",
            server_url: server.config.serverURL,
            server_ip: server.config.serverIP,
            server_port: server.config.serverPort,
            version_protocol: response.version?.protocol ?? 0,
            player_count: response.players?.online ?? 0,
            max_player_count: response.players?.max ?? 0,
            last_available: lastMentionedServer
              ? `<t:${lastMentionedServer.timestamp}:R>`
              : t("server.last-fetch.Nunca"),
          }),
          inline: true,
        },
        {
          name: t("server.last-column.top", {
            server_name: server.name,
            server_status: ServerInfo,
            server_runtime: response.version?.name ?? "",
            server_url: server.config.serverURL,
            server_ip: server.config.serverIP,
            server_port: server.config.serverPort,
            version_protocol: response.version?.protocol ?? 0,
            player_count: response.players?.online ?? 0,
            max_player_count: response.players?.max ?? 0,
            last_available: lastMentionedServer
              ? `<t:${lastMentionedServer.timestamp}:R>`
              : t("server.last-fetch.Nunca"),
          }),
          value: t("server.last-column.bottom", {
            server_name: server.name,
            server_status: ServerInfo,
            server_runtime: response.version?.name ?? "",
            server_url: server.config.serverURL,
            server_ip: server.config.serverIP,
            server_port: server.config.serverPort,
            version_protocol: response.version?.protocol ?? 0,
            player_count: response.players?.online ?? 0,
            max_player_count: response.players?.max ?? 0,
            last_available: lastMentionedServer
              ? `<t:${lastMentionedServer.timestamp}:R>`
              : t("server.last-fetch.Nunca"),
          }),
          inline: true,
        },
      ]);
    }
  }
  return groupServers(arrangedServers);
}
