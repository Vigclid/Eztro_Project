import mongoose, { Document, Types } from "mongoose";
import { IRole } from "../roles/role.model";

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
      required: true,
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

export default mongoose.model<IUser>("users", UserSchema);
