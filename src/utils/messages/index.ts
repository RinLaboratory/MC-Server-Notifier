import { env } from "~/env";
import type { TServer } from "../validators";

const serverStatusOptions = {
  online: " está Operativo.",
  offline: " está fuera de línea.",
  unknown: " Tuvo un error inesperado al revisar su estado",
};

interface ServerMessageProps {
  title: string;
  color: number;
  server: TServer;
  serverStatus: "online" | "offline" | "unknown";
}

export default function ServerMessage({
  title,
  color,
  server,
  serverStatus,
}: ServerMessageProps) {
  const discordMentions: string[] = [];

  if (serverStatus !== "online") {
    discordMentions.push("<@PrimaryDiscordID>");
    discordMentions.push("<@SecondaryDiscordID>");
  }

  return {
    username: env.DISCORD_WEBHOOK_NAME,
    avatar_url: env.DISCORD_WEBHOOK_PROFILEPICTURE,
    content: serverStatus !== "online" ? discordMentions.toString() : "",
    embeds: [
      {
        title: title,
        color: color,
        thumbnail: {
          url: "",
        },
        fields: [
          {
            name: `El Servidor ${server.name} ${serverStatusOptions[serverStatus]}`,
            value:
              serverStatus !== "online"
                ? "Revisar porfavor \n" + server.config.serverURL
                : "",
            inline: true,
          },
        ],
      },
    ],
  };
}
