import si from "systeminformation";
import type { TServer, TSystemStatus } from "./validators";
import logger from "./logger";

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
    ramUsage: ((ramUsage.total - ramUsage.available) * 100) / ramUsage.total,
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
    logger.error(
      `Failed to fetch other machine ${serverIP}:${serverPort}`,
      error,
    );
    return undefined;
  }
}
