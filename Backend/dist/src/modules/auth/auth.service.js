"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../../config/jwt");
const user_service_1 = require("../users/user.service");
const imageUtils_1 = require("../../utils/imageUtils");
class AuthService {
    static async login(email, password) {
        const users = await new user_service_1.userService().getAllPopulated();
        const user = users.find((u) => u.email === email);
        if (!user)
            return { status: 0, message: "Email not exists" };
        if (!user.statusActive)
            return { status: 0, message: "Your account has been disabled" };
        if (user.loginFailedTime && user.loginFailedTime > new Date()) {
            const timeDifference = user.loginFailedTime.getTime() - new Date().getTime();
            const timeRemaining = Math.abs(timeDifference) / 1000;
            return { status: 0, message: `Your account has been locked for ${timeRemaining} seconds` };
        }
        const valid = bcryptjs_1.default.compareSync(password, user.password);
        if (!valid) {
            user.accessFailedCount = user.accessFailedCount + 1;
            if (user.accessFailedCount % 3 === 0) {
                user.loginFailedTime = new Date(Date.now() + 15 * 1000);
            }
            await user.save();
            return { status: 0, message: "Wrong password" };
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.roleId.name }, jwt_1.jwtConfig.secret, { expiresIn: jwt_1.jwtConfig.expiresIn });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, jwt_1.jwtConfig.secret, { expiresIn: jwt_1.jwtConfig.refreshExpiresIn });
        return { status: 1, accessToken, refreshToken, user };
    }
    static signByUser(user) {
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.roleId.name }, jwt_1.jwtConfig.secret, { expiresIn: jwt_1.jwtConfig.expiresIn });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, jwt_1.jwtConfig.secret, { expiresIn: jwt_1.jwtConfig.refreshExpiresIn });
        return { accessToken, refreshToken, user };
    }
    static refresh(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, jwt_1.jwtConfig.secret);
            const newAccessToken = jsonwebtoken_1.default.sign({ id: decoded.id }, jwt_1.jwtConfig.secret, {
                expiresIn: jwt_1.jwtConfig.expiresIn,
            });
            return newAccessToken;
        }
        catch {
            return null;
        }
    }
    static async loginWithGoogle(googleUserInfo) {
        try {
            const userServiceInstance = new user_service_1.userService();
            let user = await userServiceInstance.getByEmail(googleUserInfo.email);
            if (!user) {
                await userServiceInstance.create({
                    profilePicture: (await (0, imageUtils_1.uploadImage)(googleUserInfo.picture, 1, false)).url,
                    firstName: googleUserInfo.family_name,
                    lastName: googleUserInfo.given_name,
                    phoneNumber: "",
                    dateOfBirth: new Date(),
                    password: Math.random().toString(36).slice(-8),
                    email: googleUserInfo.email,
                    statusActive: true,
                    accessFailedCount: 0,
                    loginFailedTime: null,
                });
                user = await userServiceInstance.getByEmail(googleUserInfo.email);
            }
            return user;
        }
        catch (error) {
            return null;
        }
    }
}
exports.AuthService = AuthService;
