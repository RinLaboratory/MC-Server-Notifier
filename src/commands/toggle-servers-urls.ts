import type { BaseInteraction } from "discord.js";
import { SlashCommandBuilder } from "discord.js";
import { toggleServersURLs } from "~/methods/toggle-servers-urls";
import checkUserPermissions from "~/middlewares/user-perms";
import { t } from "~/utils/translations";

export default function toggleServersURLsCommand() {
  return {
    data: new SlashCommandBuilder()
      .setName("toggle-servers-urls")
      .setDescription(t("commands.toggle-servers-urls.description")),
    async execute(interaction: BaseInteraction) {
      await checkUserPermissions(interaction, async () => {
        await toggleServersURLs(interaction);
      });
    },
  };
}
