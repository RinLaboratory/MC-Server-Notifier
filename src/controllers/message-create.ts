import { onCreateMessage } from "~/methods/message-create";
import { clientStore } from "~/store/client-store";
import logger from "~/utils/logger";

export default function messageCreate() {
  const { client } = clientStore.getState();

  if (!client) {
    return logger.fatal("client has not been initialized");
  }

  client.on("messageCreate", onCreateMessage);
}
