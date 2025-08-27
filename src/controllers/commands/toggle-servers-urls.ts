/* eslint-disable @typescript-eslint/unbound-method */
import type { BaseInteraction } from "discord.js";
import { checkUserPermissions, commandResponseHandler } from "@middlewares";
import { toggleURLService } from "@services/toggle-servers-urls";
import { t } from "@utils/translations";
import { SlashCommandBuilder } from "discord.js";

export default function toggleServersURLsCommand() {
  return {
    data: new SlashCommandBuilder()
      .setName("toggle-servers-urls")
      .setDescription(t("commands.toggle-servers-urls.description")),
    async execute(interaction: BaseInteraction) {
      await checkUserPermissions(interaction, async () => {
        await commandResponseHandler(
          interaction,
          toggleURLService.toggleServersURLs,
        );
      });
    },
  };
}
