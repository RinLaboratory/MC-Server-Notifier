/* eslint-disable @typescript-eslint/no-misused-promises */
import { Events } from "discord.js";
import { onCommandInteraction } from "~/methods/command-interaction";
import { clientStore } from "~/store/client-store";
import logger from "~/utils/logger";

export function interaction() {
  const { client } = clientStore.getState();

  if (!client) {
    return logger.fatal("client has not been initialized");
  }

  client.on(Events.InteractionCreate, onCommandInteraction);
}
