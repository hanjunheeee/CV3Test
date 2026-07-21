import { createApiClient, signIn } from './auth.js';
import { LIST_TYPES } from './constants.js';
import { fetchRankingList } from './fetcher.js';
import { parseRankingList } from './parser.js';
import { saveRankings } from './saver.js';
import { delay } from './utils/delay.js';
import { log, logError } from './utils/logger.js';

export async function runCrawler(credentials) {
  log('크롤링 시작');

  try {
    const client = createApiClient();
    await signIn(client, credentials);
    await delay(300);

    const labangResponse = await fetchRankingList(client, LIST_TYPES.labang);
    await delay(300);
    const homeshoppingResponse = await fetchRankingList(client, LIST_TYPES.homeshopping);

    const rankings = [
      ...parseRankingList(labangResponse, LIST_TYPES.labang),
      ...parseRankingList(homeshoppingResponse, LIST_TYPES.homeshopping),
    ];

    const saved = await saveRankings(rankings);

    log(`크롤링 완료: ${saved.length}건 저장`);
    return saved;
  } catch (error) {
    logError('크롤링 실패:', error.message);
    throw error;
  }
}
