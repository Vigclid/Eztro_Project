import { Router } from "express";
import packageRoutes from '../../modules/package/package.routes'

const router = Router()
router.use('/packages', packageRoutes)

export default router