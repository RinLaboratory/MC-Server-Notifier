import type { Message } from "discord.js";
import { discordStore } from "~/store/discord-store";
import { messageStore } from "~/store/message-store";

export function onCreateMessage(message: Message) {
  // EL ULTIMO MENSAJE ENVIADO PERTENECE AL BOT EN EL CANAL DESIGNADO
  const { DISCORD_BOT_CHANNEL_ID, DISCORD_BOT_CLIENT_ID } =
    discordStore.getState();

  const { sentEmbededMessages } = messageStore.getState();

  if (
    message.channelId === DISCORD_BOT_CHANNEL_ID &&
    message.author.id === DISCORD_BOT_CLIENT_ID
  ) {
    if (
      message.embeds.length !== 0 &&
      !sentEmbededMessages.find((sentMessage) => sentMessage.id === message.id)
    ) {
      sentEmbededMessages.push(message);
      messageStore.setState({ sentEmbededMessages });
    }
  }
}
