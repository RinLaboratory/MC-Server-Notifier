import type { InteractionReply, ServiceResult } from "@validators";
import type { BaseInteraction } from "discord.js";
import loadConfigYaml from "@utils/load-config-yaml";
import loadLangYaml from "@utils/load-lang-yaml";
import { logger, service } from "@utils/services";
import { t } from "@utils/translations";
import { MessageFlags } from "discord.js";

@service()
class ReloadService {
  async reload(
    _interaction: BaseInteraction,
  ): Promise<ServiceResult<InteractionReply>> {
    await loadConfigYaml();
    await loadLangYaml();

    logger.log("reloaded config");
    return {
      success: true,
      data: {
        content: t("commands.reload.reply"),
        flags: MessageFlags.Ephemeral,
      },
    };
  }
}
export const reloadService = new ReloadService();
