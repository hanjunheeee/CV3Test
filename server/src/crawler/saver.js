import { replaceAllRankings } from '../services/ranking.service.js';
import { log } from './utils/logger.js';

export async function saveRankings(rankings) {
  if (!rankings.length) {
    log('저장할 데이터가 없습니다.');
    return [];
  }

  const saved = await replaceAllRankings(rankings);
  log(`${saved.length}건 저장 완료`);
  return saved;
}
