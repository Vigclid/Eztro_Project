"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const roleMiddleware_1 = require("../../middlewares/roleMiddleware");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const router = (0, express_1.Router)();
const UserController = new user_controller_1.userController(new user_service_1.userService());
router.route("/").post(UserController.createAccount).get(UserController.getAll);
// router.route("/search").get(authenticate, UserController.getUserIsActive);
router.route("/me/password").put(authMiddleware_1.authenticate, UserController.changePassword);
router
    .route("/me/avatar")
    .put(authMiddleware_1.authenticate, UserController.uploadAvatar)
    .get(UserController.getAvatar);
router.route("/me/password/reset").post(UserController.resetPassword);
// ---------- ADMIN ----------
router.route("/count").get(authMiddleware_1.authenticate, (0, roleMiddleware_1.authorize)(["Admin"]), UserController.getNumberOfUsers);
router.route("/me/profile").put(UserController.updateProfile);
router
    .route("/:id")
    .get(UserController.getById)
    .put(authMiddleware_1.authenticate, UserController.update)
    .delete(authMiddleware_1.authenticate, (0, roleMiddleware_1.authorize)(["Admin"]), UserController.delete);
router.route("/exist/:email").get(UserController.checkExistEmail);
router.route("/:id/lock").put(authMiddleware_1.authenticate, (0, roleMiddleware_1.authorize)(["Admin"]), UserController.lockAccount);
router.route("/:id/unlock").put(authMiddleware_1.authenticate, (0, roleMiddleware_1.authorize)(["Admin"]), UserController.unlockAccount);
exports.default = router;
