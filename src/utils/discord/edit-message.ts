import type { TServerResponse } from "@validators";
import { messageStore } from "@store";
import { arrangeServers } from "@utils/minecraft";
import { t } from "@utils/translations";
import { EmbedBuilder } from "discord.js";

interface EditMessageProps {
  serverResponse: TServerResponse[];
}

export async function editMessage({ serverResponse }: EditMessageProps) {
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
      .setTitle(t("embed.title"))
      .setDescription(t("embed.description"))
      .addFields(messageField.flat())
      .setTimestamp()
      .setFooter({ text: t("embed.footer") });

    await sentEmbededMessage.edit({ embeds: [embededMessage] });
  }
}
