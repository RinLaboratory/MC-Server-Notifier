import fs from "node:fs/promises";
import path from "node:path";
import { parse as yamlParse } from "yaml";
import { YamlConfigSchema } from "./validators";
import { parseMentionUsers } from "./parse-mention-users";
import { store } from "~/store/shared-store";

export default async function loadYaml() {
  const fileRoute = path.join(import.meta.dirname, "..", "config.yaml");
  const loadedFile = await fs.readFile(fileRoute, { encoding: "utf8" });

  const file = await YamlConfigSchema.parseAsync(yamlParse(loadedFile));

  parseMentionUsers(file.discordConfig.mentionUsers);
  store.setState({
    DISCORD_BOT_TOKEN: file.discordConfig.DISCORD_BOT_TOKEN,
    channelId: file.discordConfig.DISCORD_BOT_CHANNEL_ID,
  });

  return file;
}
