import { EmbedBuilder } from "discord.js";
import type { TServerResponse } from "~/utils/validators";
import { arrangeServers } from "./arrange-servers";
import { messageStore } from "~/store/message-store";

interface EditMessageProps {
  serverResponse: TServerResponse[];
}

export default async function editMessage({
  serverResponse,
}: EditMessageProps) {
  const { sentEmbededMessages } = messageStore.getState();
  const _arrangedServers = await arrangeServers({
    serverResponse,
  });

  for (const [index, sentEmbededMessage] of sentEmbededMessages.entries()) {
    const messageField = _arrangedServers[index];
    if (!messageField)
      return console.warn(
        "encountered a message that was sent but no server is being displayed",
      );

    const embededMessage = new EmbedBuilder()
      .setColor(15258703)
      .setTitle("Server Status")
      .setDescription("Servidores bajo observación")
      .addFields(messageField.flat())
      .setTimestamp()
      .setFooter({ text: "Última Actualización" });

    await sentEmbededMessage.edit({ embeds: [embededMessage] });
  }
}
