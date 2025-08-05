interface State {
  loadedLanguage: Record<string, object> | undefined;
}

let state: State = {
  loadedLanguage: {},
};

export const langStore = {
  getState: () => state,
  setState: (partial: Partial<State>) => {
    state = { ...state, ...partial };
  },
  update: <K extends keyof State>(key: K, value: State[K]) => {
    state[key] = value;
  },
};
