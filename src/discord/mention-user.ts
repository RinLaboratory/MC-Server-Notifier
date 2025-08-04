import type { Client, TextChannel } from "discord.js";
import { store } from "~/store/shared-store";
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
  const { lastMentionMessage, channelId, userMentions, mentionReason } =
    store.getState();
  if (!channelId) {
    return logger.fatal("Invalid channelId");
  }

  const channel = client.channels.cache.get(channelId) as
    | TextChannel
    | undefined;
  if (!lastMentionMessage && channel) {
    if (!mentionReason.find((value) => value === server.name)) {
      store.setState({ mentionReason: [...mentionReason, server.name] });
      await channel.send(userMentions.toString());
    }
  }
}
