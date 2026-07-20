import TableRow from './TableRow';

export default function DataTable({ rankings, loading, onDelete }) {
  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (!rankings.length) {
    return <p>표시할 데이터가 없습니다.</p>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>제목</th>
          <th>내용</th>
          <th>출처</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        {rankings.map((ranking) => (
          <TableRow key={ranking.id} ranking={ranking} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  );
}
