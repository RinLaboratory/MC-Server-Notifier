import type { BaseInteraction } from "discord.js";
import { SlashCommandBuilder } from "discord.js";
import { reload } from "~/methods/reload";
import checkUserPermissions from "~/middlewares/user-perms";
import { t } from "~/utils/translations";

export default function reloadCommand() {
  return {
    data: new SlashCommandBuilder()
      .setName("reload")
      .setDescription(t("commands.reload.description")),
    async execute(interaction: BaseInteraction) {
      await checkUserPermissions(interaction, async () => {
        await reload(interaction);
      });
    },
  };
}
