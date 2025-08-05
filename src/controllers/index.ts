import botLogin from "./bot-login";
import { interaction } from "./interaction";
import messageCreate from "./message-create";

export default async function controllersHandler() {
  messageCreate();
  await botLogin();
  interaction();
}
