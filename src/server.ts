/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { initializeDiscordBot } from "@controllers/handlers/initalize-bot";
import { mainService } from "@services/main";
import loadConfigYaml from "@utils/load-config-yaml";
import loadLangYaml from "@utils/load-lang-yaml";

export default async function createApp() {
  await loadConfigYaml();
  await loadLangYaml();
  await initializeDiscordBot();

  const interval = 15000; // 15 seconds

  // execute initial task
  await mainService.monitorServerTask();

  // invoke task after time period repeatedly
  setInterval(mainService.monitorServerTask, interval);
}
