/* eslint-disable @typescript-eslint/no-misused-promises */
import { onBotLogin } from "~/methods/bot-login";
import { clientStore } from "~/store/client-store";
import logger from "~/utils/logger";

export default async function botLogin() {
  const { client } = clientStore.getState();

  if (!client) {
    return logger.fatal("client has not been initialized");
  }

  // Tackle race condition caused client.once expecting a void return instead of a promise
  await new Promise<void>((resolve) => {
    if (client.isReady()) {
      return resolve();
    }
    client.once("ready", async () => {
      await onBotLogin();
      resolve();
    });
  });
}
