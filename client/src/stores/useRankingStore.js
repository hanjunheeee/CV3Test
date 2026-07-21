import { create } from 'zustand';
import { rankingApi } from '../api/rankingApi';

export const useRankingStore = create((set, get) => ({
  rankings: [],
  hsKind: '라방',
  loading: false,
  error: null,

  setHsKind: (hsKind) => set({ hsKind }),

  fetchRankings: async (hsKind) => {
    const kind = hsKind ?? get().hsKind;

    set({ loading: true, error: null, hsKind: kind });
    try {
      const rankings = await rankingApi.getAll(kind);
      set({ rankings, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addRanking: async (data) => {
    set({ loading: true, error: null });
    try {
      const ranking = await rankingApi.create(data);
      set({ rankings: [ranking, ...get().rankings], loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  removeRanking: async (id) => {
    set({ loading: true, error: null });
    try {
      await rankingApi.delete(id);
      set({
        rankings: get().rankings.filter((ranking) => ranking.id !== id),
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
