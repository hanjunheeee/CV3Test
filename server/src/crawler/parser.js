import {
  HS_KIND_BY_TYPE,
  PLATFORM_LABELS,
  RANKING_LIMIT,
} from './constants.js';

function parseBroadcastAt(value) {
  if (!value) return null;

  const str = String(value);

  if (str.length === 12) {
    const year = str.slice(0, 4);
    const month = str.slice(4, 6);
    const day = str.slice(6, 8);
    const hour = str.slice(8, 10);
    const minute = str.slice(10, 12);
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
  }

  if (str.length === 10) {
    const year = `20${str.slice(0, 2)}`;
    const month = str.slice(2, 4);
    const day = str.slice(4, 6);
    const hour = str.slice(6, 8);
    const minute = str.slice(8, 10);
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
  }

  return null;
}

function resolveCompany(item) {
  if (item.platform_name) return item.platform_name.slice(0, 45);

  const platformId = item.platform_id || '';
  const label = PLATFORM_LABELS[platformId];
  if (label) return label.slice(0, 45);

  return platformId.slice(0, 45) || '미상';
}

function resolveClassification(item, categoryMap) {
  if (item.cat?.cat_name) return item.cat.cat_name.slice(0, 45);
  if (item.cid && categoryMap?.has(item.cid)) {
    return categoryMap.get(item.cid);
  }
  return '미분류';
}

function resolveTitle(item, type) {
  const title = type === 'hs' ? item.hsshow_title : item.title;
  return (title || '').trim().slice(0, 255);
}

function resolveSourceUrl(item, type) {
  if (item.hsshow_url_live) return item.hsshow_url_live;

  const objectId = item.objectID || item.hsshow_id;
  if (!objectId) return null;

  const path = type === 'hs' ? 'hsshow' : 'labang';
  return `https://live.ecomm-data.com/report/${path}/${objectId}`;
}

function mapListItem(item, type, rank, categoryMap) {
  const broadcastRaw =
    type === 'hs' ? item.hsshow_datetime_start : item.datetime_start;

  return {
    hsKind: HS_KIND_BY_TYPE[type],
    rank,
    title: resolveTitle(item, type),
    company: resolveCompany(item),
    classification: resolveClassification(item, categoryMap),
    broadcastAt: parseBroadcastAt(broadcastRaw),
    viewCount: item.visit_cnt ?? null,
    salesVolume: item.sales_cnt ?? null,
    revenue: item.sales_amt ?? null,
    productCount: type === 'hs' ? item.item_cnt ?? null : item.product_cnt ?? null,
    sourceUrl: resolveSourceUrl(item, type),
  };
}

export function parseRankingList({ list = [] }, type, categoryMap = new Map()) {
  return list
    .slice(0, RANKING_LIMIT)
    .map((item, index) => mapListItem(item, type, index + 1, categoryMap))
    .filter((item) => item.title && item.broadcastAt);
}
