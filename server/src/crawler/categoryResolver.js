import { delay } from './utils/delay.js';
import { log } from './utils/logger.js';

function parseCategoryPage(html) {
  const nextMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!nextMatch) return null;

  const data = JSON.parse(nextMatch[1]);
  const category = data.props?.pageProps?._category;
  if (!category?.title) return null;

  return {
    title: category.title,
    pid: category.pid ?? null,
  };
}

async function fetchCategoryMeta(client, cid, cache) {
  if (cache.has(cid)) return cache.get(cid);

  const response = await client.get(`/report/category/${cid}`);
  const meta = parseCategoryPage(response.data);
  cache.set(cid, meta);
  return meta;
}

async function resolveCategoryLabel(client, cid, cache) {
  const category = await fetchCategoryMeta(client, cid, cache);
  if (!category) return null;

  if (category.pid) {
    const parent = await fetchCategoryMeta(client, category.pid, cache);
    if (parent?.title) return parent.title.slice(0, 45);
  }

  return category.title.slice(0, 45);
}

export async function buildCategoryMap(client, cids) {
  const uniqueCids = [...new Set(cids.filter(Boolean))];
  if (!uniqueCids.length) return new Map();

  log(`카테고리 조회: ${uniqueCids.length}건`);
  const cache = new Map();
  const categoryMap = new Map();

  for (const cid of uniqueCids) {
    const label = await resolveCategoryLabel(client, cid, cache);
    if (label) categoryMap.set(cid, label);
    await delay(150);
  }

  return categoryMap;
}
