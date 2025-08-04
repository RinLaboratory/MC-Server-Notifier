/* eslint-disable @typescript-eslint/no-misused-promises */
import type { APIEmbedField, TextChannel } from "discord.js";
import { Client, EmbedBuilder, GatewayIntentBits } from "discord.js";
import { REST } from "discord.js";
import { env } from "~/env";
import type { TServerResponse, TYamlConfig } from "~/utils/validators";
import { arrangeServers } from "./arrange-servers";
import { FetchServer } from "~/utils/fetch-server";
import { store } from "~/store/shared-store";

interface DiscordBotProps {
  file: TYamlConfig;
}

export async function discordBot({ file }: DiscordBotProps) {
  const { discordConfig, servers } = file;

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  const channelId = discordConfig.DISCORD_BOT_CHANNEL_ID;
  store.setState({ channelId });

  const arrangedServers: APIEmbedField[][] = [];

  new REST({ version: "10" }).setToken(env.DISCORD_BOT_TOKEN);

  await client.login(env.DISCORD_BOT_TOKEN);

  client.on("ready", async () => {
    console.log(`Logged in as ${client.user?.tag}!`);

    // OBTENER SERVIDOR ACTUAL
    const guild = client.guilds.cache.get(discordConfig.DISCORD_BOT_GUILD_ID);
    if (!guild) return;

    // OBTENER CANAL DESIGNADO
    const targetChannel = guild.channels.cache.get(channelId) as
      | TextChannel
      | undefined;
    if (!targetChannel) return;

    try {
      // BORRAR TODOS LOS MENSAJES DEL CANAL
      await targetChannel.bulkDelete(100);
    } catch (error) {
      console.error("Error al borrar mensajes:", error);
    }

    const serverResponse: TServerResponse[] = [];
    for (const server of servers) {
      serverResponse.push(await FetchServer(server));
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
