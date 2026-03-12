import { create } from 'zustand';

const useStore = create((set) => ({
  language: 'en',
  setLanguage: (l) => set({ language: l }),

  anonymousMode: false,
  setAnonymousMode: (v) => set({ anonymousMode: v }),

  queryResult: null,
  setQueryResult: (r) => set({ queryResult: r }),
  clearResult: () => set({ queryResult: null, queryError: null }),

  isLoading: false,
  setLoading: (v) => set({ isLoading: v }),

  queryError: null,
  setQueryError: (e) => set({ queryError: e }),

  queryHistory: [],
  addToHistory: (q, r) =>
    set((s) => ({
      queryHistory: [
        { query: q, result: r, timestamp: new Date().toISOString() },
        ...s.queryHistory,
      ].slice(0, 20),
    })),

  sosOpen: false,
  setSosOpen: (v) => set({ sosOpen: v }),
}));

export default useStore;
