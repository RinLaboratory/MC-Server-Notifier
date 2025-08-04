import type { Client } from "discord.js";
import mentionPeople from "~/discord/mention-user";
import {
  getCurrentMachineInfo,
  getOtherMachineInfo,
} from "~/utils/get-machine-info";
import type { TServer, TSystemStatus } from "~/utils/validators";

interface GetCurrentMachineStatusProps {
  client: Client<boolean>;
  server: TServer;
}

export async function getMachineStatus({
  server,
  client,
}: GetCurrentMachineStatusProps) {
  let machine: TSystemStatus | undefined;

  if (server.name === "localhost") {
    machine = await getCurrentMachineInfo();
  } else {
    machine = await getOtherMachineInfo(server);
  }

  let verboseCurrentRamUsage = `${machine?.ramUsage.toFixed(1)} %`;
  let verboseCurrentDiskUsage = `${machine?.diskUsage.toFixed(3)} %`;
  let isStatusAcceptable = true;

  if (machine && machine.ramUsage > 90) {
    verboseCurrentRamUsage = ` ⚠️ ${machine.ramUsage.toFixed(1)} %`;
    isStatusAcceptable = false;
  }
  if (machine && machine.diskUsage > 90) {
    verboseCurrentDiskUsage = ` ⚠️ ${machine.diskUsage.toFixed(3)} %`;
    isStatusAcceptable = false;
  }

  const currentMachineData = [
    {
      name: "D1 CPU LOAD",
      value: `${machine?.load.toFixed(1)}`,
      inline: true,
    },
    {
      name: "D1 USO DE RAM",
      value: verboseCurrentRamUsage,
      inline: true,
    },
    {
      name: "D1 USO DE DISCO",
      value: verboseCurrentDiskUsage,
      inline: true,
    },
  ];

  if (!isStatusAcceptable) {
    await mentionPeople({ client });
  }

  return currentMachineData;
}
