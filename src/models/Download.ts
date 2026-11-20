import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDownloadDocument extends Document {
  orderId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  productTitle: string;
  customerEmail: string;
  token: string;
  expiresAt: Date;
  downloadCount: number;
  lastDownloadedAt?: Date;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DownloadSchema: Schema<IDownloadDocument> = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    productTitle: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    lastDownloadedAt: {
      type: Date,
      default: null,
    },
    ipAddress: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

DownloadSchema.index({ orderId: 1, productId: 1 });

const Download: Model<IDownloadDocument> =
  mongoose.models.Download ||
  mongoose.model<IDownloadDocument>("Download", DownloadSchema);

export default Download;
