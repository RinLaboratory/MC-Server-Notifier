import { MessageFlags } from "discord.js";
import type { BaseInteraction } from "discord.js";
import loadConfigYaml from "~/utils/load-config-yaml";
import logger from "~/utils/logger";

export async function reload(interaction: BaseInteraction) {
  await loadConfigYaml();

  if (interaction.isRepliable()) {
    logger.log("reloaded config");
    return interaction.reply({
      content: "reloaded config",
      flags: MessageFlags.Ephemeral,
    });
  }
}
