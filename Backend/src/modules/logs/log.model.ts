import mongoose, { Document } from "mongoose";

export interface ILog extends Document {
  timestamp: Date;
  level: string;
  message: string;
  meta: {
    method: string;
    url: string;
    status: number;
    response_time: number;
    ip: string;
    origin: string;
    host: string;
    userAgent: string;
    body?: any;
  };
}

const LogSchema = new mongoose.Schema<ILog>(
  {
    timestamp: { type: Date, default: Date.now, index: true },
    level: { type: String, default: "info" },
    message: { type: String },
    meta: {
      method: { type: String },
      url: { type: String, index: true },
      status: { type: Number },
      response_time: { type: Number },
      ip: { type: String, index: true },
      origin: { type: String },
      host: { type: String },
      userAgent: { type: String },
      body: { type: mongoose.Schema.Types.Mixed },
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

// TTL index - auto delete logs after 30 days
LogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

export default mongoose.model<ILog>("app_logs", LogSchema);
