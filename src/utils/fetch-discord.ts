import { env } from "~/env";
import type { DiscordMessage } from "./validators";
import type { JavaStatusResponse } from "minecraft-server-util";

interface FetchDiscordProps {
  message: DiscordMessage;
  serverResponse: Partial<JavaStatusResponse>;
  serverName: string;
}

export default async function fetchDiscord({
  message,
  serverResponse,
  serverName,
}: FetchDiscordProps) {
  await fetch(env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(message),
  }).then(() => {
    console.log(
      "Server [" +
        serverName +
        "]: Running " +
        (serverResponse.version?.name ?? "unknown")
    );
  });
}
