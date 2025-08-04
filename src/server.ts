/* eslint-disable @typescript-eslint/no-misused-promises */
import { FetchServer } from "./utils/fetch-server";
import LoadYaml from "./utils/load-yaml";
import { discordBot } from "./discord/bot";
import editMessage from "./discord/edit-message";
import type { TServerResponse } from "./utils/validators";
import { store } from "./store/shared-store";
import { parseMentionUsers } from "./utils/parse-mention-users";

export default async function createApp() {
  const file = await LoadYaml();
  const { servers, discordConfig } = file;
  parseMentionUsers(discordConfig.mentionUsers);

  const { client, arrangedServers } = await discordBot({
    file,
  });

  client.on("messageCreate", (message) => {
    // EL ULTIMO MENSAJE ENVIADO PERTENECE AL BOT EN EL CANAL DESIGNADO
    if (
      message.channelId === discordConfig.DISCORD_BOT_CHANNEL_ID &&
      message.author.id === discordConfig.DISCORD_BOT_CLIENT_ID
    ) {
      if (message.mentions.users.toJSON().length !== 0) {
        store.setState({ lastMentionMessage: message });
      }
      if (message.embeds.length !== 0) {
        store.setState({ lastEmbedMessage: message });
      }
    }
  });

  const interval = 15000; // 15 segundos

  const task = async () => {
    const serverResponse: TServerResponse[] = [];
    for (const server of servers) {
      serverResponse.push(await FetchServer(server));
    }

    await editMessage({
      arrangedServers,
      client,
      serverResponse,
    });
  };

  // Ejecutar la tarea inicialmente
  await task();

  // Configurar el intervalo para ejecutar la tarea repetidamente
  setInterval(task, interval);
}
