import mongoose, { Schema, Document, Model } from "mongoose";

export type ProjectStatus =
  | "pending"
  | "in-progress"
  | "review"
  | "delivered"
  | "cancelled";

export interface IProject extends Document {
  clientId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: ProjectStatus;
  price?: number;
  deliveryDate?: Date;
  thumbnailUrl?: string;
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "in-progress", "review", "delivered", "cancelled"],
      default: "pending",
    },
    price: { type: Number },
    deliveryDate: { type: Date },
    thumbnailUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Project: Model<IProject> =
  mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);

export default Project;