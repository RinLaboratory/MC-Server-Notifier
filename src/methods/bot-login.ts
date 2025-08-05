import { EmbedBuilder } from "discord.js";
import type { TextChannel } from "discord.js";
import { arrangeServers } from "~/minecraft/arrange-servers";
import { clientStore } from "~/store/client-store";
import { discordStore } from "~/store/discord-store";
import { serverStore } from "~/store/server-store";
import { fetchServer } from "~/utils/fetch-server";
import logger from "~/utils/logger";
import { t } from "~/utils/translations";
import type { TServerResponse } from "~/utils/validators";

export async function onBotLogin() {
  const { client } = clientStore.getState();
  const { DISCORD_BOT_GUILD_ID, DISCORD_BOT_CHANNEL_ID } =
    discordStore.getState();
  const { servers } = serverStore.getState();

  if (!client) {
    return logger.fatal("client has not been initialized");
  }

  console.log(`Logged in as ${client.user?.tag}!`);

  // OBTENER SERVIDOR ACTUAL
  const guild = client.guilds.cache.get(DISCORD_BOT_GUILD_ID);
  if (!guild) return logger.fatal("server not found");

  // OBTENER CANAL DESIGNADO
  const targetChannel = guild.channels.cache.get(DISCORD_BOT_CHANNEL_ID) as
    | TextChannel
    | undefined;
  if (!targetChannel) return logger.fatal("channel not found");

  try {
    // BORRAR TODOS LOS MENSAJES DEL CANAL
    await targetChannel.bulkDelete(100);
  } catch (error) {
    logger.error("Error al borrar mensajes:", error);
  }

  const serverResponse: TServerResponse[] = [];
  for (const server of servers) {
    serverResponse.push(await fetchServer(server));
  }

  const _arrangedServers = await arrangeServers({
    serverResponse,
  });

  for (const messageField of _arrangedServers) {
    // CREAR MENSAJE
    const embededMessage = new EmbedBuilder()
      .setColor(15258703)
      .setTitle(t("embed.title"))
      .setDescription(t("embed.description"))
      .addFields(messageField.flat())
      .setTimestamp()
      .setFooter({ text: t("embed.footer") });
    // ENVIAR EL MENSAJE
    await targetChannel.send({ embeds: [embededMessage] });
  }
}
