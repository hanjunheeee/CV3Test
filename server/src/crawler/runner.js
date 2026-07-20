import { fetchPage } from './fetcher.js';
import { parsePage } from './parser.js';
import { saveItems } from './saver.js';
import { delay } from './utils/delay.js';
import { log, logError } from './utils/logger.js';

const DEFAULT_TARGET_URL = 'https://example.com';

export async function runCrawler(targetUrl = DEFAULT_TARGET_URL) {
  log(`크롤링 시작: ${targetUrl}`);

  try {
    const html = await fetchPage(targetUrl);
    await delay(500);

    const items = parsePage(html, targetUrl);
    const saved = await saveItems(items);

    log('크롤링 완료');
    return saved;
  } catch (error) {
    logError('크롤링 실패:', error.message);
    throw error;
  }
}
