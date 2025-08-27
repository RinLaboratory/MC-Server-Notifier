import fs from "node:fs/promises";
import path from "node:path";
import { parse as yamlParse } from "yaml";
import { discordStore } from "~/store/discord-store";
import { serverStore } from "~/store/server-store";
import { parseMentionUsers } from "./parse-mention-users";
import { YamlConfigSchema } from "./validators";

export default async function loadConfigYaml() {
  const fileRoute = path.join(import.meta.dirname, "..", "config.yaml");
  const loadedFile = await fs.readFile(fileRoute, { encoding: "utf8" });

  const file = await YamlConfigSchema.parseAsync(yamlParse(loadedFile));
  discordStore.setState({ ...file.discordConfig });
  parseMentionUsers(file.discordConfig.mentionUsers);

  serverStore.setState({ servers: file.servers });
}
