/* eslint-disable @typescript-eslint/no-misused-promises */
import { fetchServer } from "./utils/fetch-server";
import loadConfigYaml from "./utils/load-yaml";
import { initializeDiscordBot } from "./discord/initalize-bot";
import editMessage from "./discord/edit-message";
import type { TServerResponse } from "./utils/validators";
import { serverStore } from "./store/server-store";

export default async function createApp() {
  await loadConfigYaml();
  await initializeDiscordBot();

  const interval = 15000; // 15 segundos

  const task = async () => {
    const { servers } = serverStore.getState();

    const serverResponse: TServerResponse[] = [];
    for (const server of servers) {
      serverResponse.push(await fetchServer(server));
    }

    await editMessage({
      serverResponse,
    });
  };

  // Ejecutar la tarea inicialmente
  await task();

  // Configurar el intervalo para ejecutar la tarea repetidamente
  setInterval(task, interval);
}
