import mongoose, { Schema, Document, Model } from "mongoose";

export type ActivityType =
  | "file-uploaded"
  | "message-sent"
  | "status-changed"
  | "project-created"
  | "project-deleted";

export interface IActivity extends Document {
  projectId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  userRole: "client" | "admin";
  type: ActivityType;
  text: string;
  meta?: Record<string, unknown>;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    userRole: {
      type: String,
      enum: ["client", "admin"],
      required: true,
    },
    type: {
      type: String,
      enum: [
        "file-uploaded",
        "message-sent",
        "status-changed",
        "project-created",
        "project-deleted",
      ],
      required: true,
    },
    text: { type: String, required: true },
    meta: { type: Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

const Activity: Model<IActivity> =
  mongoose.models.Activity ||
  mongoose.model<IActivity>("Activity", ActivitySchema);

export default Activity;