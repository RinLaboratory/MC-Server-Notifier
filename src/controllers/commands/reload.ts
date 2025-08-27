/* eslint-disable @typescript-eslint/unbound-method */
import type { BaseInteraction } from "discord.js";
import { checkUserPermissions, commandResponseHandler } from "@middlewares";
import { reloadService } from "@services/reload";
import { t } from "@utils/translations";
import { SlashCommandBuilder } from "discord.js";

export default function reloadCommand() {
  return {
    data: new SlashCommandBuilder()
      .setName("reload")
      .setDescription(t("commands.reload.description")),
    async execute(interaction: BaseInteraction) {
      await checkUserPermissions(interaction, async () => {
        await commandResponseHandler(interaction, reloadService.reload);
      });
    },
  };
}
