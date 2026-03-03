"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const base_controller_1 = require("../../core/controllers/base.controller");
const ApiResponseWrapper_1 = require("../../interfaces/wrapper/ApiResponseWrapper");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class userController extends base_controller_1.GenericController {
    constructor(userService) {
        super(userService);
        this.getAllPopulated = async (_req, res) => {
            res.json((0, ApiResponseWrapper_1.responseWrapper)("success", "Fetched successfully", await this.UserService.getAllPopulated()));
        };
        this.createAccount = async (req, res) => {
            try {
                const emailExists = await this.UserService.getByEmail(req.body.email);
                if (!emailExists) {
                    const result = await this.UserService.createAccount(req.body);
                    return res
                        .status(201)
                        .json((0, ApiResponseWrapper_1.responseWrapper)("success", "Đăng ký tài khoản thành công", result));
                }
                else {
                    return res.status(200).json((0, ApiResponseWrapper_1.responseWrapper)("error", "Email đã tồn tại"));
                }
            }
            catch (error) {
                if (error.code === 11000) {
                    return res.status(200).json((0, ApiResponseWrapper_1.responseWrapper)("error", "Email đã tồn tại"));
                }
                res.status(500).json((0, ApiResponseWrapper_1.responseWrapper)("error", "Internal Server Error"));
            }
        };
        this.changePassword = async (req, res) => {
            try {
                const { password, oldPassword } = req.body;
                const { id } = jsonwebtoken_1.default.decode(req.headers["authorization"]?.split(" ")[1]);
                const checkPass = await this.UserService.checkPassword(id, oldPassword);
                if (!checkPass)
                    return res.status(200).json((0, ApiResponseWrapper_1.responseWrapper)("error", "Wrong old password"));
                await this.UserService.changePassword(id, password);
                res.json((0, ApiResponseWrapper_1.responseWrapper)("success", "Change password successfully"));
            }
            catch (error) {
                res.status(404).json((0, ApiResponseWrapper_1.responseWrapper)("error", "Something wrongs!", error));
            }
        };
        this.checkExistEmail = async (req, res) => {
            try {
                const email = String(req.params.email || "").trim().toLowerCase();
                if (!email)
                    return res.status(400).json((0, ApiResponseWrapper_1.responseWrapper)("error", "Email is required"));
                const user = await this.UserService.getByEmail(email);
                return res
                    .status(200)
                    .json((0, ApiResponseWrapper_1.responseWrapper)("success", "Checked successfully", { exists: !!user }));
            }
            catch (error) {
                res.status(500).json((0, ApiResponseWrapper_1.responseWrapper)("error", "Internal Server Error", error));
            }
        };
        this.resetPassword = async (req, res) => {
            try {
                const { email, password } = req.body;
                const user = await this.UserService.changePasswordByEmail(email, password);
                return res
                    .status(200)
                    .json((0, ApiResponseWrapper_1.responseWrapper)("success", "Password reset successfully", { user }));
            }
            catch (error) {
                res.status(500).json((0, ApiResponseWrapper_1.responseWrapper)("error", "Internal Server Error", error));
            }
        };
        this.lockAccount = async (req, res) => {
            try {
                const userId = String(req.params.id || "").trim();
                if (!userId)
                    return res.status(400).json((0, ApiResponseWrapper_1.responseWrapper)("error", "User ID is required"));
                await this.UserService.lockAccount(userId);
                return res.status(200).json((0, ApiResponseWrapper_1.responseWrapper)("success", "Account locked successfully"));
            }
            catch (error) {
                res.status(500).json((0, ApiResponseWrapper_1.responseWrapper)("error", "Internal Server Error", error));
            }
        };
        this.unlockAccount = async (req, res) => {
            try {
                const userId = String(req.params.id || "").trim();
                if (!userId)
                    return res.status(400).json((0, ApiResponseWrapper_1.responseWrapper)("error", "User ID is required"));
                await this.UserService.unlockAccount(userId);
                return res.status(200).json((0, ApiResponseWrapper_1.responseWrapper)("success", "Account unlocked successfully"));
            }
            catch (error) {
                res.status(500).json((0, ApiResponseWrapper_1.responseWrapper)("error", "Internal Server Error", error));
            }
        };
        this.getUserIsActive = async (_req, res) => {
            try {
                const user = await this.UserService.getUserIsActive();
                res.json((0, ApiResponseWrapper_1.responseWrapper)("success", "Get user successfully", user));
            }
            catch (error) {
                res.json((0, ApiResponseWrapper_1.responseWrapper)("error", "Get user fail", error));
            }
        };
        this.updateProfile = async (req, res) => {
            try {
                const { id } = jsonwebtoken_1.default.decode(req.headers["authorization"]?.split(" ")[1]);
                const updatedUser = await this.UserService.updateProfile(id, req.body);
                if (!updatedUser) {
                    return res.status(404).json((0, ApiResponseWrapper_1.responseWrapper)("error", "User not found"));
                }
                res.status(200).json((0, ApiResponseWrapper_1.responseWrapper)("success", "Profile updated successfully", updatedUser));
            }
            catch (error) {
                res.status(500).json((0, ApiResponseWrapper_1.responseWrapper)("error", "Internal Server Error", error));
            }
        };
        this.getNumberOfUsers = async (_req, res) => {
            try {
                const count = await this.UserService.getNumberOfUsers();
                res
                    .status(200)
                    .json((0, ApiResponseWrapper_1.responseWrapper)("success", "Fetched user count successfully", { count }));
            }
            catch (error) {
                res.status(500).json((0, ApiResponseWrapper_1.responseWrapper)("error", "Failed to fetch user count", error));
            }
        };
        this.uploadAvatar = async (req, res) => {
            try {
                const { id } = jsonwebtoken_1.default.decode(req.headers["authorization"]?.split(" ")[1]);
                const avatar = req.body.avatar;
                const updatedUser = await this.UserService.uploadAvatar(id, avatar);
                if (!updatedUser) {
                    return res.status(404).json((0, ApiResponseWrapper_1.responseWrapper)("error", "User not found"));
                }
                res.status(200).json((0, ApiResponseWrapper_1.responseWrapper)("success", "Avatar updated successfully", updatedUser));
            }
            catch (error) {
                res.status(500).json((0, ApiResponseWrapper_1.responseWrapper)("error", "Internal Server Error", error));
            }
        };
        this.getAvatar = async (req, res) => {
            try {
                const { id } = jsonwebtoken_1.default.decode(req.headers["authorization"]?.split(" ")[1]);
                const avatar = await this.UserService.getAvatar(id);
                if (!avatar) {
                    return res.status(404).json((0, ApiResponseWrapper_1.responseWrapper)("error", "User not found"));
                }
                res.status(200).json((0, ApiResponseWrapper_1.responseWrapper)("success", "Avatar fetched successfully", avatar));
            }
            catch (error) {
                res.status(500).json((0, ApiResponseWrapper_1.responseWrapper)("error", "Internal Server Error", error));
            }
        };
        this.UserService = userService;
    }
}
exports.userController = userController;
