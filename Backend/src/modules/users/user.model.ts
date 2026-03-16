import mongoose, { Document, Types } from "mongoose";
import { IRole } from "../roles/role.model";
import settingModel, { DEFAULT_SETTING_VALUES } from "../settings/settings.model";

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roleId: Types.ObjectId | IRole;
  dateOfBirth?: Date;
  lastLogin?: Date;
  accessFailedCount: number;
  profilePicture?: string;
  statusActive: boolean;
  createdAt: Date;
  loginFailedTime: Date | null;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    roleId: {
      type: Types.ObjectId,
      ref: "roles",
      required: false,
    },
    dateOfBirth: { type: Date },
    lastLogin: { type: Date },
    accessFailedCount: { type: Number, default: 0 },
    profilePicture: { type: String },
    statusActive: { type: Boolean, default: true },
    loginFailedTime: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

UserSchema.post("save", async function (doc) {
  if ((doc as any).__wasNew) {
    await settingModel.create({ userId: doc._id, ...DEFAULT_SETTING_VALUES });
  }
});

UserSchema.pre("save", function (next) {
  (this as any).__wasNew = this.isNew;
  next();
});

export default mongoose.model<IUser>("users", UserSchema);
