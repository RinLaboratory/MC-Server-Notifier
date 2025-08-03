import z from "zod";

const ConfigSchema = z.object({
  serverIP: z.string().ip(),
  serverPort: z.coerce.number().int().positive().max(65535),
  serverURL: z.string().url(),
});

export type TServerConfig = z.infer<typeof ConfigSchema>;

export const ServerSchema = z.object({
  name: z.string(),
  config: ConfigSchema,
});

export type TServer = z.infer<typeof ServerSchema>;

export const YamlConfigSchema = z.object({
  servers: z.array(ServerSchema),
});

export type TYamlConfig = z.infer<typeof YamlConfigSchema>;

export interface SetupWorkerProps {
  workerPosition: number;
  server: TServer;
}

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
