/* eslint-disable @typescript-eslint/no-misused-promises */
import { initializeDiscordBot } from "./controllers/handlers/initalize-bot";
import loadConfigYaml from "./utils/load-config-yaml";
import loadLangYaml from "./utils/load-lang-yaml";
import { monitorServerTask } from "./utils/minecraft/monitor-server-task";

export default async function createApp() {
  await loadConfigYaml();
  await loadLangYaml();
  await initializeDiscordBot();

  const interval = 15000; // 15 seconds

  // execute initial task
  await monitorServerTask();

  // invoke task after time period repeatedly
  setInterval(monitorServerTask, interval);
}
