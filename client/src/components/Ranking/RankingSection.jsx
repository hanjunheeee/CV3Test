import { useEffect } from 'react';
import { useRankingStore } from '../../stores/useRankingStore';
import KindToggle from './KindToggle';
import RankingTable from './RankingTable';

export default function RankingSection() {
  const { rankings, hsKind, loading, error, fetchRankings, setHsKind } = useRankingStore();

  useEffect(() => {
    fetchRankings(hsKind);
  }, [fetchRankings, hsKind]);

  return (
    <section className="ranking-section">
      <KindToggle value={hsKind} onChange={setHsKind} />
      {error && <p className="error">{error}</p>}
      <RankingTable rankings={rankings} hsKind={hsKind} loading={loading} />
    </section>
  );
}
