import mentionPeople from "./mention-user";
import type { Client } from "discord.js";
import type { JavaStatusLegacyResponse } from "minecraft-server-util";
import { store } from "~/store/shared-store";

interface ServerStatusProps {
  serverResponse: Partial<JavaStatusLegacyResponse>;
  client: Client<boolean>;
}

export default async function serverStatus({
  serverResponse,
  client,
}: ServerStatusProps) {
  if (serverResponse.version?.name === "Unknown - Offline") {
    await mentionPeople({ client });
    return " ⚠️ Fuera de línea";
  } else {
    const { lastMentionMessage } = store.getState();
    if (lastMentionMessage) {
      await lastMentionMessage.delete();
      store.setState({ lastMentionMessage: undefined });
    }
    return "  🟢 En línea";
  }
}
