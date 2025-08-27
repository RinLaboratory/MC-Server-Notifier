import type { APIEmbedField } from "discord.js";
import type { TServerResponse } from "~/utils/validators";
import { httpStatus } from "~/machine/http-status";
import { getMachineStatus } from "~/machine/machine-status";
import { clientStore } from "~/store/client-store";
import { messageStore } from "~/store/message-store";
import logger from "~/utils/logger";
import { t } from "~/utils/translations";
import { groupServers } from "./group-servers";
import serverStatus from "./server-status";

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
      const ServerInfo = await serverStatus({
        server,
        serverResponse: httpServerResponse,
      });

      const { memorizedLastMentionTimestamp, hideServersURLs } =
        messageStore.getState();
      const lastMentionedServer = memorizedLastMentionTimestamp.find(
        (value) => value.serverName === server.name,
      );

      const placeholder_options = {
        server_name: server.name,
        server_status: ServerInfo,
        server_runtime: response.version?.name ?? "",
        server_url: hideServersURLs
          ? t("commands.toggle-servers-urls.hidden")
          : server.config.serverURL,
        server_ip: server.config.serverIP,
        server_port: server.config.serverPort,
        version_protocol: response.version?.protocol ?? 0,
        player_count: response.players?.online ?? 0,
        max_player_count: response.players?.max ?? 0,
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
    } else {
      const ServerInfo = await serverStatus({
        server,
        serverResponse: response,
      });

      const { memorizedLastMentionTimestamp, hideServersURLs } =
        messageStore.getState();
      const lastMentionedServer = memorizedLastMentionTimestamp.find(
        (value) => value.serverName === server.name,
      );

      const placeholder_options = {
        server_name: server.name,
        server_status: ServerInfo,
        server_runtime: response.version?.name ?? "",
        server_url: hideServersURLs
          ? t("commands.toggle-servers-urls.hidden")
          : server.config.serverURL,
        server_ip: server.config.serverIP,
        server_port: server.config.serverPort,
        version_protocol: response.version?.protocol ?? 0,
        player_count: response.players?.online ?? 0,
        max_player_count: response.players?.max ?? 0,
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
  }
  return groupServers(arrangedServers);
}
