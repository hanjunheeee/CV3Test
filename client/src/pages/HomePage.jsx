import { useEffect } from 'react';
import DataTable from '../components/Table/DataTable';
import { useRankingStore } from '../stores/useRankingStore';

export default function HomePage() {
  const { rankings, loading, error, fetchRankings, removeRanking } = useRankingStore();

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  return (
    <main className="page">
      <header className="page-header">
        <h1>데이터 테이블</h1>
        <p>크롤링된 데이터를 테이블로 확인합니다.</p>
      </header>

      {error && <p className="error">{error}</p>}

      <DataTable rankings={rankings} loading={loading} onDelete={removeRanking} />
    </main>
  );
}
