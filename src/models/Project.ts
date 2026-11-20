import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  salePrice?: number;
  techStack: string[];
  liveUrl: string;
  imageUrl: string;
  imagePublicId: string;
  screenshots: string[];
  features: string[];
  downloadFileUrl?: string;
  downloadFileName?: string;
  whatsappMessage: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema<IProject> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a project title"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      trim: true,
      default: "Other",
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
      min: 0,
    },
    salePrice: {
      type: Number,
      min: 0,
      default: null,
    },
    techStack: {
      type: [String],
      required: true,
      default: [],
    },
    liveUrl: {
      type: String,
      required: [true, "Please provide a live URL"],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Please provide an image URL"],
      trim: true,
    },
    imagePublicId: {
      type: String,
      required: [true, "Please provide a Cloudinary image ID"],
      trim: true,
    },
    screenshots: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    downloadFileUrl: {
      type: String,
      trim: true,
      default: "",
    },
    downloadFileName: {
      type: String,
      trim: true,
      default: "",
    },
    whatsappMessage: {
      type: String,
      required: [true, "Please provide a WhatsApp message"],
      trim: true,
      default: "Hi, I'm interested in this website template.",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ProjectSchema.index({ category: 1, isActive: 1 });
ProjectSchema.index({ createdAt: -1 });

const Project: Model<IProject> =
  mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
