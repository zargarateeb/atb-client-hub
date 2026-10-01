import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFileAsset extends Document {
  projectId: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  uploadedByRole: "client" | "admin";
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  publicId: string;
  createdAt: Date;
}

const FileAssetSchema = new Schema<IFileAsset>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    uploadedByRole: {
      type: String,
      enum: ["client", "admin"],
      required: true,
    },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    publicId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

const FileAsset: Model<IFileAsset> =
  mongoose.models.FileAsset ||
  mongoose.model<IFileAsset>("FileAsset", FileAssetSchema);

export default FileAsset;