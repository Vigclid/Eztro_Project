import { GenericService } from "../../core/services/base.service";
import userModel, { IUser } from "./user.model";
import roleModel from "../roles/role.model";
import bcrypt from "bcryptjs";
import { uploadImage } from "../../utils/imageUtils";

export class userService extends GenericService<IUser> {
  constructor() {
    super(userModel);
  }
  getAllPopulated = async () => {
    return userModel.find().populate("roleId").exec();
  };

  createAccount = async (data: Partial<IUser>) => {
    const role = await roleModel.findOne({ name: "Landlord" });
    if (!role) {
      throw new Error("Role 'user' not found");
    }

    const newUser = new userModel({
      ...data,
      roleId: role._id,
      password: bcrypt.hashSync(String(data.password), 8),
    });

    return (await userModel.create(newUser)).populate("roleId");
  };

  getByEmail = async (email: string) => {
    const emailExists = await userModel.findOne({ email }).populate("roleId").exec();
    return emailExists;
  };

  updateLastLogin = async (id: string) => {
    return userModel.findByIdAndUpdate(id, { lastLogin: new Date() }, { new: true });
  };

  changePassword = async (id: string, password: string) => {
    return userModel.findByIdAndUpdate(
      id,
      { password: bcrypt.hashSync(password, 8) },
      { new: true }
    );
  };

  changePasswordByEmail = async (email: string, password: string) => {
    return userModel.findOneAndUpdate(
      { email },
      { password: bcrypt.hashSync(password, 8) },
      { new: true }
    );
  };
  checkPassword = async (id: string, password: string) => {
    const user = await this.getById(id);
    if (!user) return false;
    return bcrypt.compareSync(password, user.password);
  };

  lockAccount = async (id: string) => {
    return userModel.findByIdAndUpdate(id, { statusActive: false }, { new: true });
  };

  unlockAccount = async (id: string) => {
    return userModel.findByIdAndUpdate(id, { statusActive: true }, { new: false });
  };

  updateProfile = async (id: string, data: Partial<IUser>) => {
    const { firstName, lastName, dateOfBirth, phoneNumber } = data;

    return userModel
      .findByIdAndUpdate(id, { firstName, lastName, dateOfBirth, phoneNumber }, { new: true })
      .populate("roleID");
  };

  getUserIsActive = async () => {
    try {
      const listArtwork = await userModel.find({ isActive: true });
      return listArtwork;
    } catch (error: any) {
      throw new Error(`fail to get List artwork by tag: ${error.message}`);
    }
  };

  getNumberOfUsers = async (): Promise<number> => {
    try {
      const count = await userModel.countDocuments();
      return count;
    } catch (error: any) {
      throw new Error(`Failed to get number of users: ${error.message}`);
    }
  };

  uploadAvatar = async (id: string, avatar: string) => {
    const avatarImagechange = await uploadImage(avatar, 1, false);
    return userModel.findByIdAndUpdate(
      id,
      { profilePicture: avatarImagechange.secure_url },
      { new: true }
    );
  };

  getAvatar = async (id: string) => {
    return userModel.findById(id).select("profilePicture").exec();
  };
}
