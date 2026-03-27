import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/roleMiddleware";
import { userController } from "./user.controller";
import { userService } from "./user.service";

const router = Router();
const UserController = new userController(new userService());

router.route("/").post(UserController.createAccount).get(UserController.getAll);

// Specific routes BEFORE generic /:id routes
router.route("/me/password").put(authenticate, UserController.changePassword);
router.route("/me/password/reset").post(UserController.resetPassword);
router.route("/me/profile").put(UserController.updateProfile);
router
  .route("/me/avatar")
  .put(authenticate, UserController.uploadAvatar)
  .get(UserController.getAvatar);

router.route("/tenants").get(authenticate, UserController.getAllTenants);
router.route("/count").get(authenticate, authorize(["Admin"]), UserController.getNumberOfUsers);
router.route("/exist/:email").get(UserController.checkExistEmail);

// Staff Management Routes (specific routes before /:id)
router.route("/staff/list").get(authenticate, authorize(["Admin"]), UserController.getStaffAndAdmins);
router.route("/search").get(authenticate, UserController.searchUsers);

// Generic ID routes (must be last)
router
  .route("/:id")
  .get(UserController.getById)
  .put(authenticate, UserController.update)
  .delete(authenticate, UserController.deleteAccount);

router.route("/:id/lock").put(authenticate, authorize(["Admin"]), UserController.lockAccount);
router.route("/:id/unlock").put(authenticate, authorize(["Admin"]), UserController.unlockAccount);
router.route("/:id/role").put(authenticate, authorize(["Admin"]), UserController.assignRole);
router.route("/:id/role/remove").put(authenticate, authorize(["Admin"]), UserController.removeRole);

export default router;
