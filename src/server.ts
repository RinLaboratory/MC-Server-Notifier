/* eslint-disable @typescript-eslint/no-misused-promises */
import { FetchServer } from "./utils/fetch-server";
import LoadYaml from "./utils/load-yaml";

export default async function createApp() {
  const servers = await LoadYaml();
  const interval = 15000; // 15 segundos

  const task = async () => {
    for (const server of servers) {
      await FetchServer(server);
    }
  };

  // Ejecutar la tarea inicialmente
  await task();

  // Configurar el intervalo para ejecutar la tarea repetidamente
  setInterval(task, interval);
}
