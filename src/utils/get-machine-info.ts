import si from "systeminformation";
import type { TSystemStatus, TServer } from "./validators";

export async function getCurrentMachineInfo() {
  const load = await si.currentLoad();
  const ramUsage = await si.mem();
  const diskUsage = await si.fsSize();

  const disk0Usage = diskUsage[0];
  let currentDiskUsage = -1;

  if (disk0Usage) {
    currentDiskUsage = disk0Usage.use;
  }

  return {
    load: load.currentLoad,
    ramUsage: (ramUsage.used * 100) / ramUsage.available,
    diskUsage: currentDiskUsage,
  };
}

export async function getOtherMachineInfo({ config }: TServer) {
  const { serverIP, serverPort } = config;

  try {
    return (await fetch(
      `http://${serverIP}:${serverPort}/status`,
    )) as unknown as TSystemStatus | undefined;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
