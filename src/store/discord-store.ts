import type { TDiscordConfig } from "@validators";

let state: TDiscordConfig = {
  DISCORD_BOT_CHANNEL_ID: "",
  DISCORD_BOT_CLIENT_ID: "",
  DISCORD_BOT_GUILD_ID: "",
  DISCORD_BOT_TOKEN: "",
  mentionUsers: [],
};

export const discordStore = {
  getState: () => state,
  setState: (partial: Partial<TDiscordConfig>) => {
    state = { ...state, ...partial };
  },
  update: <K extends keyof TDiscordConfig>(
    key: K,
    value: TDiscordConfig[K],
  ) => {
    state[key] = value;
  },
};
