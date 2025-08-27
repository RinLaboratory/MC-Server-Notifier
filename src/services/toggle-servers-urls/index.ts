import type { InteractionReply, ServiceResult } from "@validators";
import type { BaseInteraction } from "discord.js";
import { messageStore } from "@store";
import { logger, service } from "@utils/services";
import { t } from "@utils/translations";
import { MessageFlags } from "discord.js";

@service()
class ToggleURLService {
  async toggleServersURLs(
    _interaction: BaseInteraction,
  ): Promise<ServiceResult<InteractionReply>> {
    const { hideServersURLs } = messageStore.getState();
    const isURLsBeingHidden = !hideServersURLs;

    messageStore.setState({ hideServersURLs: isURLsBeingHidden });

    await Promise.resolve(() => {
      return;
    });

    logger.log("toggled servers URLs");
    return {
      success: true,
      data: {
        content: isURLsBeingHidden
          ? t("commands.toggle-servers-urls.reply.hidden")
          : t("commands.toggle-servers-urls.reply.shown"),
        flags: MessageFlags.Ephemeral,
      },
    };
  }
}
export const toggleURLService = new ToggleURLService();
