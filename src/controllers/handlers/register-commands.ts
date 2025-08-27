import type { REST } from "discord.js";
import { commands } from "@controllers/commands";
import { clientStore, discordStore } from "@store";
import { logger } from "@utils/services";
import { Routes } from "discord.js";

export default async function registerCommands(restClient: REST) {
  const { DISCORD_BOT_CLIENT_ID, DISCORD_BOT_GUILD_ID } =
    discordStore.getState();

  const { client } = clientStore.getState();

  if (!client) {
    return logger.fatal("client has not been initialized");
  }

  const pendingCommands = commands();

  for (const command of pendingCommands) {
    client.commands.set(command.data.name, command);
  }

  try {
    // The put method is used to fully refresh all commands in the guild with the current set
    const registeredCommands = (await restClient.put(
      Routes.applicationGuildCommands(
        DISCORD_BOT_CLIENT_ID,
        DISCORD_BOT_GUILD_ID,
      ),
      { body: pendingCommands.map((command) => command.data.toJSON()) },
    )) as unknown[];
    logger.log(`successfully registered ${registeredCommands.length} commands`);
  } catch (error) {
    logger.error("failed to register commands", error);
  }
}
