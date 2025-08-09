import reloadCommand from "./reload";
import toggleServersURLsCommand from "./toggle-servers-urls";

export function commands() {
  return [reloadCommand(), toggleServersURLsCommand()];
}
