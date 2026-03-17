import { Router } from "express";
import { TicketController } from "./ticket.controller";
import { authenticate } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/roleMiddleware";

const router = Router();
const ticketController = new TicketController();

// Routes cho tenant
router.post("/tenant", authenticate, ticketController.createByTenant);
router.get("/tenant/my-tickets", authenticate, ticketController.getByTenant);

// Routes cho landlord
router.post("/landlord", authenticate, authorize(["Landlord"]), ticketController.createByLandlord);
router.get("/landlord/my-tickets", authenticate, authorize(["Landlord"]), ticketController.getByLandlord);

// Routes chung (cần authentication)
router.get("/", authenticate, ticketController.getAll);
router.get("/:id", authenticate, ticketController.getById);
router.get("/house/:houseId", authenticate, ticketController.getByHouse);
router.get("/room/:roomId", authenticate, ticketController.getByRoom);

// Reply và update status (cả landlord và tenant đều có thể reply)
router.post("/:ticketId/reply", authenticate, ticketController.addReply);

// Chỉ landlord có thể update status
router.patch("/:ticketId/status", authenticate, authorize(["Landlord"]), ticketController.updateStatus);

// Xóa ticket (người tạo hoặc landlord có thể xóa)
router.delete("/:id", authenticate, ticketController.delete);

export default router;
