import fs from "node:fs/promises";
import path from "node:path";
import { discordStore, serverStore } from "@store";
import { parseMentionUsers } from "@utils/discord";
import { YamlConfigSchema } from "@validators";
import { parse as yamlParse } from "yaml";

export default async function loadConfigYaml() {
  const fileRoute = path.join(import.meta.dirname, "..", "config.yaml");
  const loadedFile = await fs.readFile(fileRoute, { encoding: "utf8" });

  const file = await YamlConfigSchema.parseAsync(yamlParse(loadedFile));
  discordStore.setState({ ...file.discordConfig });
  parseMentionUsers(file.discordConfig.mentionUsers);

  serverStore.setState({ servers: file.servers });
}
