import { create } from 'zustand';
import { rankingApi } from '../api/rankingApi';

export const useRankingStore = create((set, get) => ({
  rankings: [],
  loading: false,
  error: null,

  fetchRankings: async (hsKind) => {
    set({ loading: true, error: null });
    try {
      const rankings = await rankingApi.getAll(hsKind);
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
