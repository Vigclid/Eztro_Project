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
  accessFailedCount: number;
  profilePicture?: string;
  statusActive: boolean;
  createdAt: Date;
  loginFailedTime: Date | null;
  lastLogin?: Date;
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
    accessFailedCount: { type: Number, default: 0 },
    profilePicture: { type: String },
    statusActive: { type: Boolean, default: true },
    loginFailedTime: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IUser>("users", UserSchema);
