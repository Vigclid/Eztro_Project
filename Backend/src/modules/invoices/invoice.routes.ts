import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";

import { invoiceController } from "./invoice.controller";
import { invoiceService } from "./invoice.service";

const router = Router();
const InvoiceController = new invoiceController(new invoiceService());

router.route("/").get(InvoiceController.getAll);

router.route("/filter/all").get(authenticate, InvoiceController.getInvoicesByFilter);
router.route("/create/many").post(authenticate, InvoiceController.createNewInvoices);
router.route("/finalize/many").patch(authenticate, InvoiceController.finalizeInvoices);
router.route("/tenant/my").get(authenticate, InvoiceController.getMyInvoicesAsTenant);
router.route("/tenant/processing").get(authenticate, InvoiceController.getMyProcessingInvoice);
router
  .route("/tenant/meter-reading")
  .patch(authenticate, InvoiceController.tenantSubmitMeterReading);
router
  .route("/draft/house/:houseId")
  .get(authenticate, InvoiceController.getProcessingInvoicesByHouse);

router
  .route("/verify-transaction-image")
  .post(authenticate, InvoiceController.verifyTransactionImage);
router.route("/room/:roomId").get(authenticate, InvoiceController.getAllInvoicesByRoomId);

// Zalo Mini App routes (no JWT auth — identified via Zalo access/phone tokens)
router.route("/zalo/phone").post(InvoiceController.getZaloPhone);
router.route("/zalo/invoices").post(InvoiceController.getMyInvoicesAsZaloTenant);
router.route("/zalo/verify-image").post(InvoiceController.verifyTransactionImage);
router.route("/zalo/:id/confirm").post(InvoiceController.zaloConfirmInvoice);
router.route("/zalo").post(InvoiceController.receiveInvocieFromZalo);

router.route("/:id/tenant-confirm").patch(authenticate, InvoiceController.tenantConfirmInvoice);
router.route("/:id/accept").patch(authenticate, InvoiceController.landlordAcceptInvoice);
router.route("/:id/draft").patch(authenticate, InvoiceController.updateProcessingInvoice);
router.route("/:id").get(authenticate, InvoiceController.getInvoiceById);

router.route("/").post(authenticate, InvoiceController.createNewInvoice);

export default router;
