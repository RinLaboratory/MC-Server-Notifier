import type { TServer } from "@validators";
import type { TextChannel } from "discord.js";
import { clientStore, discordStore, messageStore } from "@store";
import { logger } from "@utils/services";

interface MentionUsersProps {
  server: TServer;
}

export async function mentionUsers({ server }: MentionUsersProps) {
  const { lastMentionMessage, mentionReason } = messageStore.getState();
  const { DISCORD_BOT_CHANNEL_ID, mentionUsers } = discordStore.getState();
  const { client } = clientStore.getState();

  if (!client) {
    return logger.fatal("client has not been initialized");
  }

  if (!DISCORD_BOT_CHANNEL_ID) {
    return logger.fatal("Invalid discord channel id");
  }

  const channel = client.channels.cache.get(DISCORD_BOT_CHANNEL_ID) as
    | TextChannel
    | undefined;

  if (!channel) {
    return logger.fatal("channel not found");
  }

  if (!mentionReason.find((value) => value === server.name)) {
    messageStore.setState({ mentionReason: [...mentionReason, server.name] });
  }

  if (!lastMentionMessage) {
    const newMention = await channel.send(mentionUsers.toString());
    messageStore.setState({ lastMentionMessage: newMention });
  }
}
