import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { getPaymentSettings } from "@/lib/payment-settings";
import { getCustomerSession } from "@/lib/customer-auth";

export const runtime = "nodejs";

function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${dateStr}-${randomStr}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const customer = body.customer;
    const itemIds: string[] = Array.isArray(body.items) ? body.items : [];

    if (!customer || !customer.name || !customer.email || !customer.phone) {
      return NextResponse.json(
        { success: false, message: "Customer name, email, and phone are required." },
        { status: 400 }
      );
    }

    if (itemIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one product item is required." },
        { status: 400 }
      );
    }

    await connectDB();

    // 1. Fetch current exchange rate and payment settings
    const settings = await getPaymentSettings();
    if (!settings.isEnabled) {
      return NextResponse.json(
        { success: false, message: "Store orders and payments are currently disabled." },
        { status: 503 }
      );
    }
    const bdtRate = settings.bdtRate || 120;

    // 2. SERVER-SIDE PRICE VERIFICATION: Fetch products from database
    const products = await Product.find({ _id: { $in: itemIds } });
    if (products.length === 0) {
      return NextResponse.json(
        { success: false, message: "Selected products could not be found." },
        { status: 404 }
      );
    }

    // 3. Construct Order Items with verified DB prices
    let totalUsd = 0;
    const orderItems = products.map((prod) => {
      const price =
        typeof prod.salePrice === "number" && prod.salePrice > 0
          ? prod.salePrice
          : prod.price;

      const priceBdt = Math.round(price * bdtRate);
      totalUsd += price;

      return {
        productId: prod._id,
        title: prod.title,
        slug: prod.slug,
        price,
        priceBdt,
        imageUrl: prod.imageUrl || "",
        downloadFileUrl: prod.downloadFileUrl || "",
      };
    });

    const totalBdt = Math.round(totalUsd * bdtRate);

    // 4. Attach logged-in customer user ID if available or find/create customer record
    const session = await getCustomerSession(request);
    let userId = session?.userId;
    if (!userId) {
      const existingUser = await User.findOne({ email: customer.email.toLowerCase().trim() });
      if (existingUser) {
        userId = existingUser._id.toString();
      }
    }

    // 5. Create Order
    const orderNumber = generateOrderNumber();
    const order = await Order.create({
      orderNumber,
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
        userId: userId || undefined,
      },
      items: orderItems,
      totalAmount: totalUsd,
      totalAmountBdt: totalBdt,
      status: "PENDING",
      notes: typeof body.notes === "string" ? body.notes.trim() : "",
    });

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        totalAmountBdt: order.totalAmountBdt,
        status: order.status,
        customer: order.customer,
        items: order.items,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create order." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getCustomerSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectDB();
    const orders = await Order.find({ "customer.email": session.email })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Customer orders retrieval error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load orders." },
      { status: 500 }
    );
  }
}
