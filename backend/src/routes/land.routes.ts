import { Router } from 'express';
import { searchLands, browseLands, getLandById, getQuarters } from '../controllers/land.controller';

const router = Router();

router.get('/search', searchLands);
router.get('/browse', browseLands);
router.get('/quarters', getQuarters);
router.get('/:id', getLandById);

export default router;
