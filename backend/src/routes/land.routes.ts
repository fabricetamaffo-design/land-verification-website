import { Router } from 'express';
import { searchLands, getLandById, getQuarters } from '../controllers/land.controller';

const router = Router();

router.get('/search', searchLands);
router.get('/quarters', getQuarters);
router.get('/:id', getLandById);

export default router;
