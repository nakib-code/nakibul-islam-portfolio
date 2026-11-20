import mongoose, { Schema, Document, Model } from "mongoose";
import { BkashAccountType } from "@/type/store";

export interface IPaymentSettingsDocument extends Document {
  bkashNumber: string;
  accountType: BkashAccountType;
  instructions: string;
  instructionsBn: string;
  isEnabled: boolean;
  bdtRate: number;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSettingsSchema: Schema<IPaymentSettingsDocument> = new Schema(
  {
    bkashNumber: {
      type: String,
      required: [true, "bKash number is required"],
      trim: true,
      default: "01700000000",
    },
    accountType: {
      type: String,
      enum: ["Personal", "Merchant"],
      default: "Personal",
    },
    instructions: {
      type: String,
      default:
        "1. Open your bKash app or dial *247#.\n2. Choose 'Send Money' (for Personal) or 'Payment' (for Merchant).\n3. Enter our bKash number.\n4. Enter the EXACT payable amount.\n5. Use your Order ID or phone as the reference.\n6. Confirm with your PIN.\n7. Copy the Transaction ID (TrxID) and submit it below.",
    },
    instructionsBn: {
      type: String,
      default:
        "১. আপনার বিকাশ অ্যাপ খুলুন অথবা *২৪৭# ডায়াল করুন।\n২. 'সেন্ড মানি' (পার্সোনাল) অথবা 'পেমেন্ট' (মার্চেন্ট) অপশন নির্বাচন করুন।\n৩. আমাদের বিকাশ নম্বরটি লিখুন।\n৪. উল্লেখিত সঠিক টাকার পরিমাণ দিন।\n৫. রেফারেন্স হিসেবে আপনার অর্ডার নম্বর ব্যবহার করুন।\n৬. আপনার পিন দিয়ে লেনদেন সম্পন্ন করুন।\n৭. প্রাপ্ত ট্রানজেকশন আইডি (TrxID) টি কপি করে নিচের বক্সে জমা দিন।",
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
    bdtRate: {
      type: Number,
      required: true,
      default: 120, // 1 USD = 120 BDT
      min: 1,
    },
    updatedBy: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentSettings: Model<IPaymentSettingsDocument> =
  mongoose.models.PaymentSettings ||
  mongoose.model<IPaymentSettingsDocument>(
    "PaymentSettings",
    PaymentSettingsSchema
  );

export default PaymentSettings;
