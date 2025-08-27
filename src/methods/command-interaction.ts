import type { BaseInteraction } from "discord.js";
import { MessageFlags } from "discord.js";
import logger from "~/utils/logger";
import { t } from "~/utils/translations";

export async function onCommandInteraction(interaction: BaseInteraction) {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    logger.error(`no command matching ${interaction.commandName} was found`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error("error while trying to execute a command", error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: t("commands.error"),
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: t("commands.error"),
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}
