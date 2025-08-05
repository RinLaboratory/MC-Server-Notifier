import type { Client } from "discord.js";

interface State {
  client: Client<boolean> | undefined;
}

let state: State = {
  client: undefined,
};

export const clientStore = {
  getState: () => state,
  setState: (partial: Partial<State>) => {
    state = { ...state, ...partial };
  },
  update: <K extends keyof State>(key: K, value: State[K]) => {
    state[key] = value;
  },
};
