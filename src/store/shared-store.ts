import type { Message } from "discord.js";

interface State {
  lastEmbedMessage: Message | undefined;
  lastMentionMessage: Message | undefined;
  channelId: string | undefined;
  userMentions: string[];
}

let state: State = {
  lastEmbedMessage: undefined,
  lastMentionMessage: undefined,
  channelId: undefined,
  userMentions: [],
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
