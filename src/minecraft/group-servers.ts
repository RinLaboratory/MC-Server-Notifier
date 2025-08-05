import type { APIEmbedField } from "discord.js";

export function groupServers(arrangedServers: APIEmbedField[][]) {
  const grouppedServers: APIEmbedField[][][] = [];
  for (let i = 0; i < arrangedServers.length; i += 8) {
    grouppedServers.push(arrangedServers.slice(i, i + 8));
  }

  return grouppedServers;
}
