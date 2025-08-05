import { getMachineStatus } from "~/machine/machine-status";
import type { TServerResponse } from "~/utils/validators";
import serverStatus from "./server-status";
import { messageStore } from "~/store/message-store";
import { groupServers } from "./group-servers";
import { clientStore } from "~/store/client-store";
import logger from "~/utils/logger";
import type { APIEmbedField } from "discord.js";

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
          name: server.name,
          value: ServerInfo,
          inline: true,
        },
        {
          name: response.version?.name ?? "",
          value: server.config.serverURL,
          inline: true,
        },
        {
          name: "Ult. Aviso",
          value: lastMentionedServer
            ? `<t:${lastMentionedServer.timestamp}:R>`
            : "Nunca",
          inline: true,
        },
      ]);
    }
  }
  return groupServers(arrangedServers);
}
