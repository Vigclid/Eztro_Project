"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const base_service_1 = require("../../core/services/base.service");
const user_model_1 = __importDefault(require("./user.model"));
const role_model_1 = __importDefault(require("../roles/role.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const imageUtils_1 = require("../../utils/imageUtils");
class userService extends base_service_1.GenericService {
    constructor() {
        super(user_model_1.default);
        this.getAllPopulated = async () => {
            return user_model_1.default.find().populate("roleId").exec();
        };
        this.createAccount = async (data) => {
            const role = await role_model_1.default.findOne({ name: "Landlord" });
            if (!role) {
                throw new Error("Role 'user' not found");
            }
            const newUser = new user_model_1.default({
                ...data,
                roleId: role._id,
                password: bcryptjs_1.default.hashSync(String(data.password), 8),
            });
            return (await user_model_1.default.create(newUser)).populate("roleId");
        };
        this.getByEmail = async (email) => {
            const emailExists = await user_model_1.default.findOne({ email }).populate("roleId").exec();
            return emailExists;
        };
        this.updateLastLogin = async (id) => {
            return user_model_1.default.findByIdAndUpdate(id, { lastLogin: new Date() }, { new: true });
        };
        this.changePassword = async (id, password) => {
            return user_model_1.default.findByIdAndUpdate(id, { password: bcryptjs_1.default.hashSync(password, 8) }, { new: true });
        };
        this.changePasswordByEmail = async (email, password) => {
            return user_model_1.default.findOneAndUpdate({ email }, { password: bcryptjs_1.default.hashSync(password, 8) }, { new: true });
        };
        this.checkPassword = async (id, password) => {
            const user = await this.getById(id);
            if (!user)
                return false;
            return bcryptjs_1.default.compareSync(password, user.password);
        };
        this.lockAccount = async (id) => {
            return user_model_1.default.findByIdAndUpdate(id, { statusActive: false }, { new: true });
        };
        this.unlockAccount = async (id) => {
            return user_model_1.default.findByIdAndUpdate(id, { statusActive: true }, { new: false });
        };
        this.updateProfile = async (id, data) => {
            const { firstName, lastName, dateOfBirth, phoneNumber } = data;
            return user_model_1.default
                .findByIdAndUpdate(id, { firstName, lastName, dateOfBirth, phoneNumber }, { new: true })
                .populate("roleID");
        };
        this.getUserIsActive = async () => {
            try {
                const listArtwork = await user_model_1.default.find({ isActive: true });
                return listArtwork;
            }
            catch (error) {
                throw new Error(`fail to get List artwork by tag: ${error.message}`);
            }
        };
        this.getNumberOfUsers = async () => {
            try {
                const count = await user_model_1.default.countDocuments();
                return count;
            }
            catch (error) {
                throw new Error(`Failed to get number of users: ${error.message}`);
            }
        };
        this.uploadAvatar = async (id, avatar) => {
            const avatarImagechange = await (0, imageUtils_1.uploadImage)(avatar, 1, false);
            return user_model_1.default.findByIdAndUpdate(id, { profilePicture: avatarImagechange.secure_url }, { new: true });
        };
        this.getAvatar = async (id) => {
            return user_model_1.default.findById(id).select("profilePicture").exec();
        };
    }
}
exports.userService = userService;
