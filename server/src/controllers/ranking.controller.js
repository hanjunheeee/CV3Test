import * as rankingService from '../services/ranking.service.js';

const RANKING_FIELDS = [
  'hsKind',
  'rank',
  'title',
  'company',
  'classification',
  'broadcastAt',
  'viewCount',
  'salesVolume',
  'revenue',
  'productCount',
  'sourceUrl',
];

function pickRankingFields(body) {
  return RANKING_FIELDS.reduce((fields, key) => {
    if (body[key] !== undefined) {
      fields[key] = body[key];
    }
    return fields;
  }, {});
}

function validateRankingPayload(data, { partial = false } = {}) {
  const requiredFields = ['hsKind', 'rank', 'title', 'company', 'classification', 'broadcastAt'];

  for (const field of requiredFields) {
    if (!partial && (data[field] === undefined || data[field] === null || data[field] === '')) {
      return `${field} is required`;
    }
  }

  if (data.hsKind && !rankingService.isValidHsKind(data.hsKind)) {
    return 'hsKind must be one of: 라방, 홈쇼핑';
  }

  if (data.rank !== undefined && (!Number.isInteger(data.rank) || data.rank < 1 || data.rank > 255)) {
    return 'rank must be an integer between 1 and 255';
  }

  return null;
}

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

export async function createRanking(req, res, next) {
  try {
    const data = pickRankingFields(req.body);
    const validationError = validateRankingPayload(data);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const ranking = await rankingService.createRanking(data);
    res.status(201).json(ranking);
  } catch (error) {
    next(error);
  }
}

export async function updateRanking(req, res, next) {
  try {
    const data = pickRankingFields(req.body);
    const validationError = validateRankingPayload(data, { partial: true });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const ranking = await rankingService.updateRanking(req.params.id, data);

    if (!ranking) {
      return res.status(404).json({ message: 'Ranking not found' });
    }

    res.json(ranking);
  } catch (error) {
    next(error);
  }
}

export async function deleteRanking(req, res, next) {
  try {
    const ranking = await rankingService.deleteRanking(req.params.id);

    if (!ranking) {
      return res.status(404).json({ message: 'Ranking not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
