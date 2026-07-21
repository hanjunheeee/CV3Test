import RankingTableRow from './RankingTableRow';

export default function RankingTable({ rankings, hsKind, loading }) {
  const viewLabel = hsKind === '홈쇼핑' ? '시청률' : '조회수';

  if (loading) {
    return <p className="ranking-table__message">로딩 중...</p>;
  }

  if (!rankings.length) {
    return <p className="ranking-table__message">표시할 데이터가 없습니다.</p>;
  }

  return (
    <div className="ranking-table-wrap">
      <table className="ranking-table">
        <thead>
          <tr>
            <th aria-label="순위" />
            <th>방송정보</th>
            <th>분류</th>
            <th>방송시간</th>
            <th>{viewLabel}</th>
            <th>판매량</th>
            <th>매출액</th>
            <th>상품수</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((ranking) => (
            <RankingTableRow
              key={ranking.id}
              ranking={ranking}
              viewLabel={viewLabel}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
