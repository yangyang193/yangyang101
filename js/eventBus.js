const listeners = new Map();

export const eventBus = {
  on(type, handler) {
    if (!listeners.has(type)) listeners.set(type, new Set());
    listeners.get(type).add(handler);
    return () => eventBus.off(type, handler);
  },

  off(type, handler) {
    const set = listeners.get(type);
    if (!set) return;
    set.delete(handler);
    if (set.size === 0) listeners.delete(type);
  },

  emit(type, payload) {
    const set = listeners.get(type);
    if (!set) return;
    for (const handler of [...set]) handler(payload);
  },
};
