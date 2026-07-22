import { HomeshoppingRanking } from '../models/HomeshoppingRanking.js';

const HS_KINDS = ['라방', '홈쇼핑'];

export function isValidHsKind(hsKind) {
  return HS_KINDS.includes(hsKind);
}

export async function getAllRankings({ hsKind } = {}) {
  const where = {};

  if (hsKind) {
    where.hsKind = hsKind;
  }

  return HomeshoppingRanking.findAll({
    where,
    order: [['hsKind', 'ASC'], ['rank', 'ASC']],
  });
}

export async function getRankingById(id) {
  return HomeshoppingRanking.findByPk(id);
}

export async function replaceAllRankings(rankings) {
  await HomeshoppingRanking.destroy({ where: {} });
  return HomeshoppingRanking.bulkCreate(rankings);
}
