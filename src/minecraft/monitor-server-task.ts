import type { TServerResponse } from "~/utils/validators";
import editMessage from "~/discord/edit-message";
import { serverStore } from "~/store/server-store";
import { fetchServer } from "~/utils/fetch-server";

export async function monitorServerTask() {
  const { servers } = serverStore.getState();

  const serverResponse: TServerResponse[] = [];
  for (const server of servers) {
    serverResponse.push(await fetchServer(server));
  }

  await editMessage({
    serverResponse,
  });
}
