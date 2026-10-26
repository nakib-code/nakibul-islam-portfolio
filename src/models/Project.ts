
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  techStack: string[];
  liveUrl: string;
  imageUrl: string;
  imagePublicId: string;
  whatsappMessage: string;
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
    },

    price: {
      type: Number,
      required: [true, "Please provide a price"],
      min: 0,
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

    whatsappMessage: {
      type: String,
      required: [true, "Please provide a WhatsApp message"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Project: Model<IProject> =
  mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
