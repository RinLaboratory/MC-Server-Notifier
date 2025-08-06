import editMessage from "~/discord/edit-message";
import { serverStore } from "~/store/server-store";
import { fetchServer } from "~/utils/fetch-server";
import type { TServerResponse } from "~/utils/validators";

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
