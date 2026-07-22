import * as rankingService from '../services/ranking.service.js';

export async function getRankings(req, res, next) {
  try {
    const { hsKind } = req.query;

    if (hsKind && !rankingService.isValidHsKind(hsKind)) {
      return res.status(400).json({ message: 'hsKind must be one of: 라방, 홈쇼핑' });
    }

    const rankings = await rankingService.getAllRankings({ hsKind });
    res.json(rankings);
  } catch (error) {
    next(error);
  }
}

export async function getRanking(req, res, next) {
  try {
    const ranking = await rankingService.getRankingById(req.params.id);

    if (!ranking) {
      return res.status(404).json({ message: 'Ranking not found' });
    }

    res.json(ranking);
  } catch (error) {
    next(error);
  }
}
