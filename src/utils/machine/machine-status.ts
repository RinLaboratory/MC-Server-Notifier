import type { TServer, TSystemStatus } from "@validators";
import { mentionUsers } from "@utils/discord";
import { getCurrentMachineInfo, getOtherMachineInfo } from "@utils/machine";
import { t } from "@utils/translations";
import { validateLocalhostIp } from "@utils/validate-localhost-ip";

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
      name: t("machine.cpu-usage", {
        machine_name: server.name,
      }),
      value: `${machine?.load.toFixed(1)} %`,
      inline: true,
    },
    {
      name: t("machine.ram-usage", {
        machine_name: server.name,
      }),
      value: verboseCurrentRamUsage,
      inline: true,
    },
    {
      name: t("machine.disk-usage", {
        machine_name: server.name,
      }),
      value: verboseCurrentDiskUsage,
      inline: true,
    },
  ];

  if (!isStatusAcceptable) {
    await mentionUsers({ server });
  }

  return currentMachineData;
}
