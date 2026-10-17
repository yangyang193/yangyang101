const STORAGE_KEY = "creator-studio-state-v1";

function emptyState() {
  return {
    profile: {
      identityId: null,
      persona: {
        nickname: "",
        bio: "",
        style: "casual",
        audience: "gen-z",
      },
      tagIds: [],
      guildId: null,
      coins: 0,
      exposure: 20,
    },
    works: [],
    ui: {
      view: "home",
      toast: null,
    },
    log: [],
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    const base = emptyState();
    return {
      ...base,
      ...parsed,
      profile: { ...base.profile, ...(parsed.profile ?? {}) },
      ui: { ...base.ui, ...(parsed.ui ?? {}), toast: null },
      works: Array.isArray(parsed.works) ? parsed.works : [],
      log: Array.isArray(parsed.log) ? parsed.log.slice(0, 80) : [],
    };
  } catch {
    return emptyState();
  }
}

let state = loadState();
const subscribers = new Set();

function persist() {
  const snapshot = { ...state, ui: { ...state.ui, toast: null } };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export const store = {
  getState() {
    return state;
  },

  setState(patch) {
    const next = typeof patch === "function" ? patch(state) : patch;
    state = next;
    persist();
    for (const listener of [...subscribers]) listener(state);
  },

  subscribe(listener) {
    subscribers.add(listener);
    return () => subscribers.delete(listener);
  },

  reset() {
    localStorage.removeItem(STORAGE_KEY);
    state = emptyState();
    persist();
    for (const listener of [...subscribers]) listener(state);
  },
};
