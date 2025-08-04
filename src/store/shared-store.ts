import type { Message } from "discord.js";

interface State {
  lastEmbedMessage: Message | undefined;
  lastMentionMessage: Message | undefined;
  mentionReason: string[];
  channelId: string | undefined;
  userMentions: string[];
  DISCORD_BOT_TOKEN: string;
}

let state: State = {
  lastEmbedMessage: undefined,
  lastMentionMessage: undefined,
  mentionReason: [],
  channelId: undefined,
  userMentions: [],
  DISCORD_BOT_TOKEN: "",
};

export const store = {
  getState: () => state,
  setState: (partial: Partial<State>) => {
    state = { ...state, ...partial };
  },
  update: <K extends keyof State>(key: K, value: State[K]) => {
    state[key] = value;
  },
};
