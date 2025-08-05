import type { Collection } from "discord.js";
import type {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from "discord.js";

declare module "discord.js" {
  interface Client {
    commands: Collection<
      string,
      {
        data: SlashCommandBuilder;
        execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
      }
    >;
  }
}
