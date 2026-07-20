export default function TableRow({ ranking, onDelete }) {
  return (
    <tr>
      <td>{ranking.id}</td>
      <td>{ranking.title}</td>
      <td>{ranking.company}</td>
      <td>
        {ranking.sourceUrl ? (
          <a href={ranking.sourceUrl} target="_blank" rel="noreferrer">
            링크
          </a>
        ) : (
          '-'
        )}
      </td>
      <td>
        <button type="button" onClick={() => onDelete(ranking.id)}>
          삭제
        </button>
      </td>
    </tr>
  );
}
