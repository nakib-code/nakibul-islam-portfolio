import mongoose, { Schema, Document, Model } from "mongoose";
import { OrderStatus } from "@/type/store";

export interface IOrderItemDocument {
  productId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  price: number;
  priceBdt: number;
  imageUrl: string;
  downloadFileUrl?: string;
}

export interface IOrderDocument extends Document {
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    userId?: mongoose.Types.ObjectId;
  };
  items: IOrderItemDocument[];
  totalAmount: number;
  totalAmountBdt: number;
  status: OrderStatus;
  paymentId?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    price: { type: Number, required: true },
    priceBdt: { type: Number, required: true },
    imageUrl: { type: String, default: "" },
    downloadFileUrl: { type: String, default: "" },
  },
  { _id: false }
);

const OrderSchema: Schema<IOrderDocument> = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    customer: {
      name: { type: String, required: true, trim: true },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
      },
      phone: { type: String, required: true, trim: true },
      userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: [
        (val: IOrderItemDocument[]) => val.length > 0,
        "Order must contain at least one item",
      ],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmountBdt: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "PENDING_VERIFICATION",
        "PAID",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "PENDING",
      index: true,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ "customer.email": 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });

const Order: Model<IOrderDocument> =
  mongoose.models.Order ||
  mongoose.model<IOrderDocument>("Order", OrderSchema);

export default Order;
