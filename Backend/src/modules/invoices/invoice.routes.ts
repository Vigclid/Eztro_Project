import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";

import { invoiceController } from "./invoice.controller";
import { invoiceService } from "./invoice.service";

const router = Router();
const InvoiceController = new invoiceController(new invoiceService());

router.route("/:id").get(authenticate, InvoiceController.getInvoiceById);

router.route("/room/:roomId").get(authenticate, InvoiceController.getAllInvoicesByRoomId);

router.route("/house/:houseId").get(authenticate, InvoiceController.getRoomsForInvoiceCreation);

router.route("/filter/all").get(authenticate, InvoiceController.getInvoicesByFilter);
router.route("/create/many").post(authenticate, InvoiceController.createNewInvoices);

router.route("/").post(authenticate, InvoiceController.createNewInvoice);
router.route("/zalo").post(InvoiceController.receiveInvocieFromZalo);

export default router;
