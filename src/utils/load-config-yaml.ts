import path from "node:path";
import { discordStore, serverStore } from "@store";
import { parseMentionUsers } from "@utils/discord";
import { readFirstExistingFile } from "@utils/read-first-existing-file";
import { YamlConfigSchema } from "@validators";
import { parse as yamlParse } from "yaml";

export default async function loadConfigYaml() {
  const configDir = process.env.CONFIG_DIR
    ? path.resolve(process.env.CONFIG_DIR)
    : undefined;

  const configFileRoutes = [
    process.env.CONFIG_PATH ? path.resolve(process.env.CONFIG_PATH) : undefined,
    configDir ? path.join(configDir, "config.yml") : undefined,
    configDir ? path.join(configDir, "config.yaml") : undefined,
    path.join(process.cwd(), "config.yml"),
    path.join(process.cwd(), "config.yaml"),
    path.join(import.meta.dirname, "..", "config.yml"),
    path.join(import.meta.dirname, "..", "config.yaml"),
  ].filter((fileRoute): fileRoute is string => Boolean(fileRoute));

  const loadedFile = await readFirstExistingFile(configFileRoutes, "Config");

  const file = await YamlConfigSchema.parseAsync(yamlParse(loadedFile));
  discordStore.setState({ ...file.discordConfig });
  parseMentionUsers(file.discordConfig.mentionUsers);

  serverStore.setState({ servers: file.servers });
}
