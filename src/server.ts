/* eslint-disable @typescript-eslint/no-misused-promises */
import { fetchServer } from "./utils/fetch-server";
import loadYaml from "./utils/load-yaml";
import { discordBot } from "./discord/bot";
import editMessage from "./discord/edit-message";
import type { TServerResponse } from "./utils/validators";
import { store } from "./store/shared-store";

export default async function createApp() {
  const file = await loadYaml();
  const { servers, discordConfig } = file;

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
      serverResponse.push(await fetchServer(server));
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
