import type { JavaStatusLegacyResponse } from "minecraft-server-util";
import z from "zod";

const ConfigSchema = z.object({
  serverIP: z.string().ip(),
  serverPort: z.coerce.number().int().positive().max(65535),
  serverURL: z.string().url(),
});

export type TServerConfig = z.infer<typeof ConfigSchema>;

export const ServerSchema = z.object({
  name: z.string(),
  isMachine: z.coerce.boolean().optional(),
  config: ConfigSchema,
});

export type TServer = z.infer<typeof ServerSchema>;

export const DiscordConfigSchema = z.object({
  DISCORD_BOT_CLIENT_ID: z.string(),
  DISCORD_BOT_GUILD_ID: z.string(),
  DISCORD_BOT_CHANNEL_ID: z.string(),
  DISCORD_BOT_TOKEN: z.string(),
  mentionUsers: z.array(z.string().regex(/^\d{17,20}$/)),
});

export type TDiscordConfig = z.infer<typeof DiscordConfigSchema>;

export const YamlConfigSchema = z.object({
  servers: z.array(ServerSchema),
  discordConfig: DiscordConfigSchema,
});

export type TYamlConfig = z.infer<typeof YamlConfigSchema>;

export interface DiscordMessage {
  username: string;
  avatar_url: string;
  content: string;
  embeds: {
    title: string;
    color: number;
    thumbnail: {
      url: string;
    };
    fields: { name: string; value: string; inline: boolean }[];
  }[];
}

export interface TServerResponse {
  server: TServer;
  response: Partial<JavaStatusLegacyResponse>;
}

export interface TSystemStatus {
  load: number;
  ramUsage: number;
  diskUsage: number;
}
