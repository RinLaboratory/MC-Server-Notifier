import type { Message } from "discord.js";

interface State {
  sentEmbededMessages: Message[];
  hideServersURLs: boolean;
  lastMentionMessage: Message | undefined;
  mentionReason: string[];
  memorizedLastMentionTimestamp: { serverName: string; timestamp: number }[];
}

let state: State = {
  sentEmbededMessages: [],
  hideServersURLs: false,
  lastMentionMessage: undefined,
  mentionReason: [],
  memorizedLastMentionTimestamp: [],
};

export const messageStore = {
  getState: () => state,
  setState: (partial: Partial<State>) => {
    state = { ...state, ...partial };
  },
  update: <K extends keyof State>(key: K, value: State[K]) => {
    state[key] = value;
  },
};
