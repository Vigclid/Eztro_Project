import { Router } from "express";
import invoiceRoutes from '../../modules/logs/log.routes';

const router = Router()
router.use('/logs', invoiceRoutes);

export default router;