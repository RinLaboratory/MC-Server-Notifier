import mentionPeople from "./mention-user";
import type { Client } from "discord.js";
import type { JavaStatusLegacyResponse } from "minecraft-server-util";
import { messageStore } from "~/store/message-store";
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

    const message = {
      serverName: server.name,
      timestamp: Math.floor(new Date().valueOf() / 1000),
    };

    const { memorizedLastMentionTimestamp } = messageStore.getState();
    const index = memorizedLastMentionTimestamp.findIndex(
      (value) => value.serverName === server.name,
    );

    if (index > -1) {
      // Server was mentioned before
      memorizedLastMentionTimestamp[index] = message;
    } else {
      // First time of server being mentioned
      memorizedLastMentionTimestamp.push(message);
    }

    messageStore.setState({ memorizedLastMentionTimestamp });

    return " ⚠️ Fuera de línea";
  } else {
    const { lastMentionMessage, mentionReason } = messageStore.getState();
    if (mentionReason.find((value) => value === server.name)) {
      const index = mentionReason.indexOf(server.name);
      mentionReason.splice(index, 1);
    }

    messageStore.setState({ mentionReason });

    if (lastMentionMessage && mentionReason.length === 0) {
      await lastMentionMessage.delete();
      messageStore.setState({ lastMentionMessage: undefined });
    }
    return "  🟢 En línea";
  }
}
