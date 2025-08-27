import type { ServiceResult, TServerResponse } from "@validators";
import type { TextChannel } from "discord.js";
import { clientStore, discordStore, serverStore } from "@store";
import { arrangeServers, fetchServer } from "@utils/minecraft";
import { logger, service } from "@utils/services";
import { t } from "@utils/translations";
import { EmbedBuilder } from "discord.js";

@service()
class BotLoginService {
  async onBotLogin(): Promise<ServiceResult<{ status: "ok" }>> {
    const { client } = clientStore.getState();
    const { DISCORD_BOT_GUILD_ID, DISCORD_BOT_CHANNEL_ID } =
      discordStore.getState();
    const { servers } = serverStore.getState();

    if (!client) {
      return logger.fatal("client has not been initialized");
    }

    const guild = client.guilds.cache.get(DISCORD_BOT_GUILD_ID);
    if (!guild) return logger.fatal("server not found");

    const targetChannel = guild.channels.cache.get(DISCORD_BOT_CHANNEL_ID) as
      | TextChannel
      | undefined;
    if (!targetChannel) return logger.fatal("channel not found");

    try {
      await targetChannel.bulkDelete(100);
    } catch (error) {
      logger.error("error when trying to prune channel messages", error);
    }

    const serverResponse: TServerResponse[] = [];
    for (const server of servers) {
      serverResponse.push(await fetchServer(server));
    }

    const _arrangedServers = await arrangeServers({
      serverResponse,
    });

    for (const messageField of _arrangedServers) {
      const embededMessage = new EmbedBuilder()
        .setColor(15258703)
        .setTitle(t("embed.title"))
        .setDescription(t("embed.description"))
        .addFields(messageField.flat())
        .setTimestamp()
        .setFooter({ text: t("embed.footer") });
      await targetChannel.send({ embeds: [embededMessage] });
    }

    return {
      success: true,
      data: { status: "ok" },
    };
  }
}
export const botLoginService = new BotLoginService();
