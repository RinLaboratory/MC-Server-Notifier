/* eslint-disable @typescript-eslint/no-misused-promises */
import type { APIEmbedField, TextChannel } from "discord.js";
import { Client, EmbedBuilder, GatewayIntentBits } from "discord.js";
import { REST } from "discord.js";
import type { TServer, TServerResponse } from "~/utils/validators";
import { arrangeServers } from "./arrange-servers";
import { fetchServer } from "~/utils/fetch-server";
import logger from "~/utils/logger";
import { discordStore } from "~/store/discord-store";

interface DiscordBotProps {
  servers: TServer[];
}

export async function discordBot({ servers }: DiscordBotProps) {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  const { DISCORD_BOT_TOKEN, DISCORD_BOT_CHANNEL_ID, DISCORD_BOT_GUILD_ID } =
    discordStore.getState();

  const arrangedServers: APIEmbedField[][] = [];

  new REST({ version: "10" }).setToken(DISCORD_BOT_TOKEN);

  await client.login(DISCORD_BOT_TOKEN);

  client.on("ready", async () => {
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

    await arrangeServers({
      arrangedServers,
      client,
      serverResponse,
    });

    // CREAR MENSAJE
    const embededMessage = new EmbedBuilder()
      .setColor(15258703)
      .setTitle("Server Status")
      .setDescription("Servidores bajo observación")
      .addFields(arrangedServers.flat())
      .setTimestamp()
      .setFooter({ text: "Última Actualización" });
    // ENVIAR EL MENSAJE
    await targetChannel.send({ embeds: [embededMessage] });
  });

  return {
    client,
    arrangedServers,
  };
}
