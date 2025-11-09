import { Router } from 'express';
import { celebrate } from 'celebrate';
import { getGoods, getGoodById } from '../controllers/goodController.js';
import { idSchema } from '../validations/idValidation.js';
import { getGoodsSchema } from '../validations/goodValidation.js';

const router = Router();

router.get('/api/goods', celebrate(getGoodsSchema), getGoods);
router.get('/api/goods/:goodId', celebrate(idSchema), getGoodById);

export default router;
