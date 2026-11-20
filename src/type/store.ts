export type BkashAccountType = "Personal" | "Merchant";

export type PaymentStatus = "PENDING_VERIFICATION" | "APPROVED" | "REJECTED";

export type OrderStatus =
  | "PENDING"
  | "PENDING_VERIFICATION"
  | "PAID"
  | "COMPLETED"
  | "CANCELLED";

export type UserRole = "customer" | "admin";

export interface ICategory {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  order?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IProductItem {
  _id: string;
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
  screenshots?: string[];
  features?: string[];
  downloadFileUrl?: string;
  downloadFileName?: string;
  whatsappMessage?: string;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CartItem {
  product: IProductItem;
  quantity: number;
}

export interface IOrderItem {
  productId: string;
  title: string;
  slug: string;
  price: number; // in USD
  priceBdt: number; // in BDT
  imageUrl: string;
  downloadFileUrl?: string;
}

export interface ICustomerInfo {
  name: string;
  email: string;
  phone: string;
  userId?: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  customer: ICustomerInfo;
  items: IOrderItem[];
  totalAmount: number; // in USD
  totalAmountBdt: number; // in BDT
  status: OrderStatus;
  paymentId?: string;
  notes?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IPayment {
  _id: string;
  orderId: string;
  orderNumber: string;
  customer: ICustomerInfo;
  paymentMethod: "bKash";
  bkashSenderNumber: string;
  bkashReceiverNumber: string;
  transactionId: string;
  amount: number; // in BDT
  status: PaymentStatus;
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: string | Date;
  submittedAt: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IPaymentSettings {
  _id?: string;
  bkashNumber: string;
  accountType: BkashAccountType;
  instructions: string;
  instructionsBn?: string;
  isEnabled: boolean;
  bdtRate: number; // Conversion rate: 1 USD = X BDT
  updatedBy?: string;
  updatedAt?: string | Date;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IDownload {
  _id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  customerEmail: string;
  token: string;
  expiresAt: string | Date;
  downloadCount: number;
  lastDownloadedAt?: string | Date;
  createdAt: string | Date;
}
