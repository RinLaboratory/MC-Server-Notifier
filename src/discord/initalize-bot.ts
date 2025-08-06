import { Client, Collection, GatewayIntentBits } from "discord.js";
import { REST } from "discord.js";
import controllersHandler from "~/controllers";
import { clientStore } from "~/store/client-store";
import { discordStore } from "~/store/discord-store";
import registerCommands from "./register-commands";

export async function initializeDiscordBot() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });
  client.commands = new Collection();

  const { DISCORD_BOT_TOKEN } = discordStore.getState();

  const restClient = new REST({ version: "10" }).setToken(DISCORD_BOT_TOKEN);

  await client.login(DISCORD_BOT_TOKEN);
  console.log(`Logged in as ${client.user?.tag}!`);

  clientStore.setState({ client });

  await controllersHandler();
  await registerCommands(restClient);
}
