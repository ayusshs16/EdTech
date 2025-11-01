import { NextResponse } from "next/server";
import { ensureStripe } from "@/configs/stripe";
import { saveCustomerRecord } from "@/configs/stripeStore";

export const runtime = "nodejs";

const normaliseAddress = (address = {}) => {
  if (!address || typeof address !== "object") return undefined;

  const cleaned = Object.fromEntries(
    Object.entries(address).filter(([, value]) => value)
  );

  if (!cleaned.line1 && !cleaned.city && !cleaned.postal_code) {
    return undefined;
  }

  return cleaned;
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, name, address, metadata } = body || {};

    if (!email) {
      return NextResponse.json(
        { error: "Email is required to create a Stripe customer." },
        { status: 400 }
      );
    }

    const stripe = ensureStripe();

    const normalizedAddress = normaliseAddress(address);

    const customer = await stripe.customers.create({
      email,
      name,
      address: normalizedAddress,
      shipping: normalizedAddress
        ? {
            name: name || email,
            address: normalizedAddress,
          }
        : undefined,
      metadata: metadata && typeof metadata === "object" ? metadata : undefined,
    });

    saveCustomerRecord({
      customerId: customer.id,
      email,
      name,
      address: normalizedAddress,
    });

    return NextResponse.json({
      customerId: customer.id,
      customer,
    });
  } catch (error) {
    console.error("[stripe] create-customer error", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Stripe customer." },
      { status: 500 }
    );
  }
}
