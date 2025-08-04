import type { Client, TextChannel } from "discord.js";
import { store } from "~/store/shared-store";

interface MentionPeopleProps {
  client: Client<boolean>;
}

export default async function mentionPeople({ client }: MentionPeopleProps) {
  const { lastMentionMessage, channelId } = store.getState();
  if (!channelId) return;

  const channel = client.channels.cache.get(channelId) as
    | TextChannel
    | undefined;
  if (!lastMentionMessage && channel) {
    await channel.send("<@344596668332769281>");
  }
}
