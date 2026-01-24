import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/roleMiddleware";
import { userController } from "./user.controller";
import { userService } from "./user.service";

const router = Router();
const UserController = new userController(new userService());

router.route("/").post(UserController.createAccount).get(UserController.getAll);
// router.route("/search").get(authenticate, UserController.getUserIsActive);

router.route("/me/password").put(authenticate, UserController.changePassword);

router
  .route("/me/avatar")
  .put(authenticate, UserController.uploadAvatar)
  .get(UserController.getAvatar);

router.route("/me/password/reset").post(UserController.resetPassword);

// ---------- ADMIN ----------
router.route("/count").get(authenticate, authorize(["Admin"]), UserController.getNumberOfUsers);

router.route("/me/profile").put(UserController.updateProfile);

router
  .route("/:id")
  .get(UserController.getById)
  .put(authenticate, UserController.update)
  .delete(authenticate, authorize(["Admin"]), UserController.delete);

router.route("/exist/:email").get(UserController.checkExistEmail);
router.route("/:id/lock").put(authenticate, authorize(["Admin"]), UserController.lockAccount);
router.route("/:id/unlock").put(authenticate, authorize(["Admin"]), UserController.unlockAccount);

export default router;
