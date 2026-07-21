export function formatBroadcastAt(value) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  const year = String(date.getFullYear()).slice(2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

  return `${year}.${month}.${day} (${weekday}) ${hours}:${minutes}`;
}

export function formatNumber(value) {
  if (value === null || value === undefined) return null;
  return Number(value).toLocaleString('ko-KR');
}

export function formatRevenue(value) {
  if (value === null || value === undefined) return null;

  const amount = Number(value);
  if (amount >= 100000000) {
    const eok = amount / 100000000;
    return `${Number.isInteger(eok) ? eok : eok.toFixed(1)}억`;
  }

  if (amount >= 10000) {
    return `${Math.round(amount / 10000).toLocaleString('ko-KR')}만`;
  }

  return amount.toLocaleString('ko-KR');
}
