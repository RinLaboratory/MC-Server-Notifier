import { EmbedBuilder } from "discord.js";
import type { APIEmbedField, Client } from "discord.js";
import type { TServerResponse } from "~/utils/validators";
import { arrangeServers } from "./arrange-servers";
import { messageStore } from "~/store/message-store";

interface EditMessageProps {
  serverResponse: TServerResponse[];
  arrangedServers: APIEmbedField[][];
  client: Client<boolean>;
}

export default async function editMessage({
  arrangedServers,
  client,
  serverResponse,
}: EditMessageProps) {
  const { lastEmbedMessage } = messageStore.getState();

  if (lastEmbedMessage) {
    const _arrangedServers = await arrangeServers({
      arrangedServers,
      client,
      serverResponse,
    });

    // CREAR MENSAJE
    const embededMessage = new EmbedBuilder()
      .setColor(15258703)
      .setTitle("Server Status")
      .setDescription("Servidores bajo observación")
      .addFields(_arrangedServers.flat())
      .setTimestamp()
      .setFooter({ text: "Última Actualización" });

    await lastEmbedMessage.edit({ embeds: [embededMessage] });
  }
}
