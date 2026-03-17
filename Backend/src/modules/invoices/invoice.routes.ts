import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";

import { invoiceController } from "./invoice.controller";
import { invoiceService } from "./invoice.service";

const router = Router();
const InvoiceController = new invoiceController(new invoiceService());

router.route("/filter/all").get(authenticate, InvoiceController.getInvoicesByFilter);
router.route("/create/many").post(authenticate, InvoiceController.createNewInvoices);
router.route("/finalize/many").patch(authenticate, InvoiceController.finalizeInvoices);
router.route("/tenant/my").get(authenticate, InvoiceController.getMyInvoicesAsTenant);
router.route("/draft/house/:houseId").get(authenticate, InvoiceController.getProcessingInvoicesByHouse);

router
  .route("/verify-transaction-image")
  .post(authenticate, InvoiceController.verifyTransactionImage);
router.route("/room/:roomId").get(authenticate, InvoiceController.getAllInvoicesByRoomId);

router.route("/:id/tenant-confirm").patch(authenticate, InvoiceController.tenantConfirmInvoice);
router.route("/:id/accept").patch(authenticate, InvoiceController.landlordAcceptInvoice);
router.route("/:id/draft").patch(authenticate, InvoiceController.updateProcessingInvoice);
router.route("/:id").get(authenticate, InvoiceController.getInvoiceById);

router.route("/").post(authenticate, InvoiceController.createNewInvoice);
router.route("/zalo").post(InvoiceController.receiveInvocieFromZalo);

export default router;
