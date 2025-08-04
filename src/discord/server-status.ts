import mentionPeople from "./mention-user";
import type { Client } from "discord.js";
import type { JavaStatusLegacyResponse } from "minecraft-server-util";
import { store } from "~/store/shared-store";
import type { TServer } from "~/utils/validators";

interface ServerStatusProps {
  serverResponse: Partial<JavaStatusLegacyResponse>;
  client: Client<boolean>;
  server: TServer;
}

export default async function serverStatus({
  serverResponse,
  client,
  server,
}: ServerStatusProps) {
  if (serverResponse.version?.name === "Unknown - Offline") {
    await mentionPeople({ client, server });
    return " ⚠️ Fuera de línea";
  } else {
    const { lastMentionMessage, mentionReason } = store.getState();
    if (mentionReason.find((value) => value === server.name)) {
      const index = mentionReason.indexOf(server.name);
      mentionReason.splice(index, 1);
    }

    store.setState({ mentionReason });

    if (lastMentionMessage && mentionReason.length === 0) {
      await lastMentionMessage.delete();
      store.setState({ lastMentionMessage: undefined });
    }
    return "  🟢 En línea";
  }
}
