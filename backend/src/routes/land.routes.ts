import { Router } from 'express';
import { searchLands, browseLands, getLandById, getQuarters } from '../controllers/land.controller';
import { optionalAuthenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(optionalAuthenticate);
router.get('/search', searchLands);
router.get('/browse', browseLands);
router.get('/quarters', getQuarters);
router.get('/:id', getLandById);

export default router;
