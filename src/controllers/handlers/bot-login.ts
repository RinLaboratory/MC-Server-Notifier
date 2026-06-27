/* eslint-disable @typescript-eslint/no-misused-promises */
import { botLoginService } from "@services/bot-login";
import { clientStore } from "@store";
import { logger } from "@utils/services";
import { Events } from "discord.js";

export default async function botLogin() {
  const { client } = clientStore.getState();

  if (!client) {
    return logger.fatal("client has not been initialized");
  }

  // Tackle race condition caused client.once expecting a void return instead of a promise
  await new Promise<void>((resolve) => {
    if (client.isReady()) {
      void botLoginService.onBotLogin().then(() => resolve());
      return;
    }
    client.once(Events.ClientReady, async () => {
      await botLoginService.onBotLogin();
      resolve();
    });
  });
}
