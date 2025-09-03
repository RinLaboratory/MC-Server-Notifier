import type { TServer } from "@validators";

interface State {
  servers: TServer[];
}

let state: State = {
  servers: [],
};

export const serverStore = {
  getState: () => state,
  setState: (partial: Partial<State>) => {
    state = { ...state, ...partial };
  },
  update: <K extends keyof State>(key: K, value: State[K]) => {
    state[key] = value;
  },
};
