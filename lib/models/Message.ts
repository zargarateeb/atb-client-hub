import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  projectId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  senderRole: "client" | "admin";
  text: string;
  read: boolean;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["client", "admin"],
      required: true,
    },
    text: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Message: Model<IMessage> =
  mongoose.models.Message ||
  mongoose.model<IMessage>("Message", MessageSchema);

export default Message;