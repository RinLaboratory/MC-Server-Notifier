import mentionUsers from "~/discord/mention-user";
import {
  getCurrentMachineInfo,
  getOtherMachineInfo,
} from "~/utils/get-machine-info";
import { validateLocalhostIp } from "~/utils/validate-localhost-ip";
import type { TServer, TSystemStatus } from "~/utils/validators";

interface GetCurrentMachineStatusProps {
  server: TServer;
}

export async function getMachineStatus({
  server,
}: GetCurrentMachineStatusProps) {
  let machine: TSystemStatus | undefined;

  if (validateLocalhostIp(server.config.serverIP)) {
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
      name: `${server.name} USO DE CPU`,
      value: `${machine?.load.toFixed(1)} %`,
      inline: true,
    },
    {
      name: `${server.name} USO DE RAM`,
      value: verboseCurrentRamUsage,
      inline: true,
    },
    {
      name: `${server.name} USO DE DISCO`,
      value: verboseCurrentDiskUsage,
      inline: true,
    },
  ];

  if (!isStatusAcceptable) {
    await mentionUsers({ server });
  }

  return currentMachineData;
}
