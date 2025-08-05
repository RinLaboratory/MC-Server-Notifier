import { MessageFlags } from "discord.js";
import type { BaseInteraction } from "discord.js";
import loadConfigYaml from "~/utils/load-config-yaml";
import loadLangYaml from "~/utils/load-lang-yaml";
import logger from "~/utils/logger";

export async function reload(interaction: BaseInteraction) {
  await loadConfigYaml();
  await loadLangYaml();

  if (interaction.isRepliable()) {
    logger.log("reloaded config");
    return interaction.reply({
      content: "reloaded config",
      flags: MessageFlags.Ephemeral,
    });
  }
}
