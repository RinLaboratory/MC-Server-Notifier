import type { Client, TextChannel } from "discord.js";
import { discordStore } from "~/store/discord-store";
import { messageStore } from "~/store/message-store";
import logger from "~/utils/logger";
import type { TServer } from "~/utils/validators";

interface MentionPeopleProps {
  client: Client<boolean>;
  server: TServer;
}

export default async function mentionPeople({
  client,
  server,
}: MentionPeopleProps) {
  const { lastMentionMessage, mentionReason } = messageStore.getState();
  const { DISCORD_BOT_CHANNEL_ID, mentionUsers } = discordStore.getState();
  if (!DISCORD_BOT_CHANNEL_ID)
    return logger.fatal("Invalid discord channel id");

  const channel = client.channels.cache.get(DISCORD_BOT_CHANNEL_ID) as
    | TextChannel
    | undefined;
  if (!channel) return logger.fatal("channel not found");

  if (
    !lastMentionMessage &&
    !mentionReason.find((value) => value === server.name)
  ) {
    messageStore.setState({ mentionReason: [...mentionReason, server.name] });
    await channel.send(mentionUsers.toString());
  }
}
