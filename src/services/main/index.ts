import type { TServerResponse } from "@validators";
import { serverStore } from "@store";
import { editMessage } from "@utils/discord";
import { fetchServer } from "@utils/minecraft";
import { service } from "@utils/services";

@service()
class MainService {
  async monitorServerTask() {
    const { servers } = serverStore.getState();

    const serverResponse: TServerResponse[] = [];
    for (const server of servers) {
      serverResponse.push(await fetchServer(server));
    }

    await editMessage({
      serverResponse,
    });
  }
}
export const mainService = new MainService();
