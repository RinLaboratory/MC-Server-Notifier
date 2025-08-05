import type { APIEmbedField, Client } from "discord.js";
import { getMachineStatus } from "~/machine/machine-status";
import type { TServerResponse } from "~/utils/validators";
import serverStatus from "./server-status";
import { messageStore } from "~/store/message-store";
import { groupServers } from "./group-servers";

interface BaseArrangementProps {
  arrangedServers: APIEmbedField[][];
  client: Client<boolean>;
}
interface UpdateArrangementProps extends BaseArrangementProps {
  serverResponse: TServerResponse[];
}

export async function arrangeServers({
  arrangedServers,
  client,
  serverResponse,
}: UpdateArrangementProps) {
  arrangedServers.length = 0;
  for (const { server, response } of serverResponse) {
    if (server.isMachine) {
      const ServerInfo = await getMachineStatus({
        client,
        server,
      });
      arrangedServers.push(ServerInfo);
    } else {
      const ServerInfo = await serverStatus({
        client,
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
