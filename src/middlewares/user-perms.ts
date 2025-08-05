import { MessageFlags } from "discord.js";
import type { BaseInteraction, GuildMember } from "discord.js";
import { t } from "~/utils/translations";

type NextFunction = () => Promise<void> | void;

export default async function checkUserPermissions(
  interaction: BaseInteraction,
  next: NextFunction,
) {
  const member = interaction.member as GuildMember;
  if (!member.permissions.has("Administrator")) {
    if (interaction.isRepliable()) {
      await interaction.reply({
        content: t("perms.missing-perms"),
        flags: MessageFlags.Ephemeral,
      });
    }
    return;
  }

  await next();
}
