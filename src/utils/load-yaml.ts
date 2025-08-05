import fs from "node:fs/promises";
import path from "node:path";
import { parse as yamlParse } from "yaml";
import { YamlConfigSchema } from "./validators";
import { parseMentionUsers } from "./parse-mention-users";
import { discordStore } from "~/store/discord-store";

export default async function loadYaml() {
  const fileRoute = path.join(import.meta.dirname, "..", "config.yaml");
  const loadedFile = await fs.readFile(fileRoute, { encoding: "utf8" });

  const file = await YamlConfigSchema.parseAsync(yamlParse(loadedFile));
  discordStore.setState({ ...file.discordConfig });
  parseMentionUsers(file.discordConfig.mentionUsers);

  return file.servers;
}
