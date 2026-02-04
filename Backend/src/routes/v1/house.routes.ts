import { Router } from "express";
import houseRoutes from '../../modules/houses/house.routes';

const router = Router()
router.use('/houses', houseRoutes);

export default router;