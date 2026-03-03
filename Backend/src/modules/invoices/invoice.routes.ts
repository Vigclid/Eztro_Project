import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";

import { invoiceController } from "./invoice.controller";
import { invoiceService } from "./invoice.service";

const router = Router();
const InvoiceController = new invoiceController(new invoiceService())

router.route('/:id')
    .get(authenticate, InvoiceController.getInvoiceById)

router.route('room/:roomId')
    .get(authenticate, InvoiceController.getAllInvoicesByRoomId)

router.route('/filter/all')
    .get(authenticate, InvoiceController.getInvoicesByFilter)

router.route('/')
    .post(authenticate, InvoiceController.createNewInvoice)


export default router