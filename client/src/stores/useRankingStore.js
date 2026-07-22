import { create } from 'zustand';
import { rankingApi } from '../api/rankingApi';

/**
 * 랭킹 목록 전역 상태 (Zustand).
 * RankingSection에서 hsKind 토글 시 fetchRankings를 호출해 라방/홈쇼핑 목록을 전환한다.
 */
export const useRankingStore = create((set, get) => ({
  /** 현재 탭에 해당하는 랭킹 목록 */
  rankings: [],
  /** 선택된 방송 유형 — '라방' | '홈쇼핑' */
  hsKind: '라방',
  loading: false,
  error: null,

  /** 토글 UI에서 hsKind만 변경 (fetch는 RankingSection useEffect에서 처리) */
  setHsKind: (hsKind) => set({ hsKind }),

  /**
   * GET /api/rankings?hsKind=... 로 목록을 불러와 rankings에 저장한다.
   * @param {string} [hsKind] 미전달 시 현재 store의 hsKind 사용
   */
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
}));
