import {
  formatBroadcastAt,
  formatNumber,
  formatRevenue,
} from './formatters';

function MetricCell({ formattedValue, locked = false }) {
  if (locked) {
    return (
      <td className="ranking-table__metric">
        <span className="metric-locked" title="잠금">
          <span className="metric-locked__icon" aria-hidden="true" />
        </span>
      </td>
    );
  }

  if (formattedValue === null) {
    return <td className="ranking-table__metric">-</td>;
  }

  return <td className="ranking-table__metric">{formattedValue}</td>;
}

export default function RankingTableRow({ ranking, viewLabel }) {
  const showLockedView = viewLabel === '시청률' && ranking.viewCount == null;

  return (
    <tr>
      <td className="ranking-table__rank">{ranking.rank}</td>
      <td className="ranking-table__info">
        <p className="ranking-table__title">{ranking.title}</p>
        <p className="ranking-table__company">{ranking.company}</p>
      </td>
      <td>{ranking.classification}</td>
      <td>{formatBroadcastAt(ranking.broadcastAt)}</td>
      <MetricCell
        formattedValue={formatNumber(ranking.viewCount)}
        locked={showLockedView}
      />
      <MetricCell formattedValue={formatNumber(ranking.salesVolume)} />
      <MetricCell formattedValue={formatRevenue(ranking.revenue)} />
      <td className="ranking-table__count">{formatNumber(ranking.productCount) ?? '-'}</td>
    </tr>
  );
}
