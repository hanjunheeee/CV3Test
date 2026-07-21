import { API_PATHS } from './constants.js';
import { log } from './utils/logger.js';

export async function fetchRankingList(client, type) {
  log(`랭킹 API 요청: type=${type}`);

  const response = await client.post(API_PATHS.list, { type });
  const { list = [], mask } = response.data;

  log(`응답 수신: ${list.length}건${mask ? ' (mask=true)' : ''}`);

  return response.data;
}
