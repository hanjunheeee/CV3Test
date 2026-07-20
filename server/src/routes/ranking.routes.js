import { Router } from 'express';
import * as rankingController from '../controllers/ranking.controller.js';

const router = Router();

router.get('/', rankingController.getRankings);
router.get('/:id', rankingController.getRanking);
router.post('/', rankingController.createRanking);
router.put('/:id', rankingController.updateRanking);
router.delete('/:id', rankingController.deleteRanking);

export default router;
