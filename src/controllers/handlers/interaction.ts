/* eslint-disable @typescript-eslint/no-misused-promises */
import { onCommandInteraction } from "@services/command-interaction";
import { clientStore } from "@store";
import { logger } from "@utils/services";
import { Events } from "discord.js";

export function interaction() {
  const { client } = clientStore.getState();

  if (!client) {
    return logger.fatal("client has not been initialized");
  }

  client.on(Events.InteractionCreate, onCommandInteraction);
}
