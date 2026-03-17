import mongoose, { Document, Types } from "mongoose";

export type Theme = "light" | "dark";

export interface ISetting extends Document {
  userId: Types.ObjectId;
  inApp: boolean;
  notifyEmail: boolean;
  notifyZalo: boolean;
  theme: Theme;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new mongoose.Schema<ISetting>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
      index: true,
    },
    inApp: { type: Boolean, default: true },
    notifyEmail: { type: Boolean, default: true },
    notifyZalo: { type: Boolean, default: false },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
  },
  { timestamps: true, versionKey: false }
);

export const DEFAULT_SETTING_VALUES: Pick<
  ISetting,
  "inApp" | "notifyEmail" | "notifyZalo" | "theme"
> = {
  inApp: true,
  notifyEmail: false,
  notifyZalo: false,
  theme: "light",
};

export default mongoose.model<ISetting>("settings", SettingSchema);
