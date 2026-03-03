import { Router } from "express";
import invoiceRoutes from '../../modules/invoices/invoice.routes';

const router = Router()
router.use('/invoices', invoiceRoutes);

export default router;