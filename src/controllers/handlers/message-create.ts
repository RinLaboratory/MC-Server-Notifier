import { onCreateMessage } from "@services/message-create";
import { clientStore } from "@store";
import { logger } from "@utils/services";

export default function messageCreate() {
  const { client } = clientStore.getState();

  if (!client) {
    return logger.fatal("client has not been initialized");
  }

  client.on("messageCreate", onCreateMessage);
}
