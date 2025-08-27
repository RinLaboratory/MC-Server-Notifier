import type { BaseInteraction } from "discord.js";
import { MessageFlags } from "discord.js";
import { messageStore } from "~/store/message-store";
import logger from "~/utils/logger";
import { t } from "~/utils/translations";

export async function toggleServersURLs(interaction: BaseInteraction) {
  const { hideServersURLs } = messageStore.getState();
  const isURLsBeingHidden = !hideServersURLs;

  messageStore.setState({ hideServersURLs: isURLsBeingHidden });

  if (interaction.isRepliable()) {
    logger.log("toggled servers URLs");
    return interaction.reply({
      content: isURLsBeingHidden
        ? t("commands.toggle-servers-urls.reply.hidden")
        : t("commands.toggle-servers-urls.reply.shown"),
      flags: MessageFlags.Ephemeral,
    });
  }
}
