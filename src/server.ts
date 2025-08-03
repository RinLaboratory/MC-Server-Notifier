import { FetchServer } from "./utils/fetch-server";
import LoadYaml from "./utils/load-yaml";

export default async function createApp() {
  const servers = await LoadYaml();

  for (const server of servers) {
    await FetchServer(server);
  }
}
