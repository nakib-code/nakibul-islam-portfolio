import { connectDB } from "@/lib/mongodb";
import PaymentSettings, {
  IPaymentSettingsDocument,
} from "@/models/PaymentSettings";
import { IPaymentSettings } from "@/type/store";

const DEFAULT_SETTINGS: Partial<IPaymentSettings> = {
  bkashNumber: "01700000000",
  accountType: "Personal",
  instructions:
    "1. Open your bKash app or dial *247#.\n2. Choose 'Send Money' (for Personal) or 'Payment' (for Merchant).\n3. Enter our bKash number.\n4. Enter the EXACT payable amount.\n5. Use your Order ID or phone as the reference.\n6. Confirm with your PIN.\n7. Copy the Transaction ID (TrxID) and submit it below.",
  instructionsBn:
    "১. আপনার বিকাশ অ্যাপ খুলুন অথবা *২৪৭# ডায়াল করুন।\n২. 'সেন্ড মানি' (পার্সোনাল) অথবা 'পেমেন্ট' (মার্চেন্ট) অপশন নির্বাচন করুন।\n৩. আমাদের বিকাশ নম্বরটি লিখুন।\n৪. উল্লেখিত সঠিক টাকার পরিমাণ দিন।\n৫. রেফারেন্স হিসেবে আপনার অর্ডার নম্বর ব্যবহার করুন।\n৬. আপনার পিন দিয়ে লেনদেন সম্পন্ন করুন।\n৭. প্রাপ্ত ট্রানজেকশন আইডি (TrxID) টি কপি করে নিচের বক্সে জমা দিন।",
  isEnabled: true,
  bdtRate: 120,
};

export async function getPaymentSettings(): Promise<IPaymentSettingsDocument> {
  await connectDB();
  let settings = await PaymentSettings.findOne();
  if (!settings) {
    settings = await PaymentSettings.create(DEFAULT_SETTINGS);
  }
  return settings;
}

export async function updatePaymentSettings(
  data: Partial<IPaymentSettings>,
  adminEmail: string
): Promise<IPaymentSettingsDocument> {
  await connectDB();
  let settings = await PaymentSettings.findOne();
  if (!settings) {
    settings = await PaymentSettings.create({
      ...DEFAULT_SETTINGS,
      ...data,
      updatedBy: adminEmail,
    });
  } else {
    if (data.bkashNumber !== undefined) settings.bkashNumber = data.bkashNumber;
    if (data.accountType !== undefined) settings.accountType = data.accountType;
    if (data.instructions !== undefined) settings.instructions = data.instructions;
    if (data.instructionsBn !== undefined) settings.instructionsBn = data.instructionsBn;
    if (data.isEnabled !== undefined) settings.isEnabled = data.isEnabled;
    if (data.bdtRate !== undefined) settings.bdtRate = data.bdtRate;
    settings.updatedBy = adminEmail;
    await settings.save();
  }
  return settings;
}
