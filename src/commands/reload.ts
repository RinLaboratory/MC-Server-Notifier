import type { BaseInteraction } from "discord.js";
import { SlashCommandBuilder } from "discord.js";
import { reload } from "~/methods/reload";
import checkUserPermissions from "~/middlewares/user-perms";

export default function reloadCommand() {
  return {
    data: new SlashCommandBuilder()
      .setName("reload")
      .setDescription("reloads app"),
    async execute(interaction: BaseInteraction) {
      await checkUserPermissions(interaction, async () => {
        await reload(interaction);
      });
    },
  };
}
