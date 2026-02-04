import { Router } from "express";
import roomRoutes from '../../modules/rooms/room.routes';

const router = Router()
router.use('/rooms', roomRoutes);

export default router;