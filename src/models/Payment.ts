import mongoose, { Schema, Document, Model } from "mongoose";
import { PaymentStatus } from "@/type/store";

export interface IPaymentDocument extends Document {
  orderId: mongoose.Types.ObjectId;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  paymentMethod: "bKash";
  bkashSenderNumber: string;
  bkashReceiverNumber: string;
  transactionId: string;
  amount: number;
  status: PaymentStatus;
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema<IPaymentDocument> = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    orderNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    customer: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
    },
    paymentMethod: {
      type: String,
      default: "bKash",
      enum: ["bKash"],
    },
    bkashSenderNumber: {
      type: String,
      required: [true, "Sender bKash number is required"],
      trim: true,
    },
    bkashReceiverNumber: {
      type: String,
      required: [true, "Receiver bKash number is required"],
      trim: true,
    },
    transactionId: {
      type: String,
      required: [true, "Transaction ID (TrxID) is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["PENDING_VERIFICATION", "APPROVED", "REJECTED"],
      default: "PENDING_VERIFICATION",
      index: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: "",
    },
    verifiedBy: {
      type: String,
      trim: true,
      default: "",
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

PaymentSchema.index({ status: 1, createdAt: -1 });

const Payment: Model<IPaymentDocument> =
  mongoose.models.Payment ||
  mongoose.model<IPaymentDocument>("Payment", PaymentSchema);

export default Payment;
