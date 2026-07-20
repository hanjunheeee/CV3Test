import { bulkCreateRankings } from '../../services/ranking.service.js';
import { log } from './utils/logger.js';

export async function saveItems(items) {
  if (!items.length) {
    log('저장할 데이터가 없습니다.');
    return [];
  }

  const saved = await bulkCreateRankings(items);
  log(`${saved.length}건 저장 완료`);
  return saved;
}
