import type { APIEmbedField, Client } from "discord.js";
import { getMachineStatus } from "~/machine/machine-status";
import type { TServer, TServerResponse } from "~/utils/validators";
import serverStatus from "./server-status";
import { store } from "~/store/shared-store";

interface BaseArrangementProps {
  arrangedServers: APIEmbedField[][];
  client: Client<boolean>;
}

type ArrangeServersProps = BaseArrangementProps &
  (
    | {
        servers: TServer[];
        serverResponse?: undefined;
      }
    | {
        servers?: undefined;
        serverResponse: TServerResponse[];
      }
  );

interface SetupArrangementProps extends BaseArrangementProps {
  servers: TServer[];
}

interface UpdateArrangementProps extends BaseArrangementProps {
  serverResponse: TServerResponse[];
}

async function setupServersArrangement({
  arrangedServers,
  servers,
  client,
}: SetupArrangementProps) {
  arrangedServers.length = 0;
  for (const server of servers) {
    if (server.isMachine) {
      const machineInfo = await getMachineStatus({
        client,
        server,
      });
      arrangedServers.push(machineInfo);
    } else {
      arrangedServers.push([
        {
          name: server.name,
          value: " ❕Loading",
          inline: true,
        },
        {
          name: "Unknown - Loading",
          value: server.config.serverURL,
          inline: true,
        },
        {
          name: "\u200b",
          value: "\u200b",
          inline: true,
        },
      ]);
    }
  }
  return arrangedServers;
}

async function updateServersArrangement({
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

      const { memorizedLastMentionTimestamp } = store.getState();
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
  return arrangedServers;
}

export async function arrangeServers({
  arrangedServers,
  client,
  serverResponse,
  servers,
}: ArrangeServersProps) {
  if (servers) {
    return setupServersArrangement({
      arrangedServers,
      client,
      servers,
    });
  } else {
    return updateServersArrangement({
      arrangedServers,
      client,
      serverResponse,
    });
  }
}
