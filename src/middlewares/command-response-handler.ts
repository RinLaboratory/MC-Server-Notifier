import type { InteractionReply, ServiceResult } from "@validators";
import type { BaseInteraction, ChatInputCommandInteraction } from "discord.js";
import { MessageFlags } from "discord.js";

type CombinedInteractions = ChatInputCommandInteraction | BaseInteraction;

type NextFunction<T> = (
  interaction: T,
  isButtonInteraction?: boolean,
) => Promise<ServiceResult<InteractionReply | { status: "ok" }>>;

export async function commandResponseHandler<T extends CombinedInteractions>(
  interaction: T,
  next: NextFunction<T>,
) {
  const response = await next(interaction, true);

  if (response.success) {
    if (interaction.isRepliable() && !("status" in response.data)) {
      await interaction.reply({
        ...response.data,
      });
    }
    return response;
  } else {
    if (interaction.isRepliable()) {
      await interaction.reply({
        content: `Error: ${response.error.message}\n\n-# Error code: ${response.error.code}`,
        flags: MessageFlags.Ephemeral,
      });
    }
    return response;
  }
}
