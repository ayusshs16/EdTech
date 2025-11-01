import { NextResponse } from "next/server";
import { ensureStripe, getAppBaseUrl } from "@/configs/stripe";
import { getCustomerRecord } from "@/configs/stripeStore";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { customerId, priceId, trialPeriodDays, metadata } = body || {};

    if (!customerId) {
      return NextResponse.json(
        { error: "customerId is required to create a Checkout Session." },
        { status: 400 }
      );
    }

    const price = priceId || process.env.STRIPE_PRICE_ID;
    if (!price) {
      return NextResponse.json(
        { error: "Stripe price ID is missing. Pass priceId or configure STRIPE_PRICE_ID." },
        { status: 400 }
      );
    }

    const stripe = ensureStripe();
    const baseUrl = getAppBaseUrl();
    const storedCustomer = getCustomerRecord(customerId);

    const session = await stripe.checkout.sessions.create({
      ui_mode: "custom",
      mode: "subscription",
      customer: customerId,
      customer_update: {
        address: "auto",
      },
      line_items: [
        {
          price,
          quantity: 1,
        },
      ],
      billing_address_collection: "auto",
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      subscription_data: trialPeriodDays
        ? { trial_period_days: Number(trialPeriodDays) }
        : undefined,
      success_url: `${baseUrl}/return?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/subscribe?canceled=true`,
      return_url: `${baseUrl}/return?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        ...(metadata && typeof metadata === "object" ? metadata : {}),
        stored_email: storedCustomer?.email,
      },
    });

    return NextResponse.json({
      clientSecret: session.client_secret,
      sessionId: session.id,
      subscriptionId: session.subscription,
      url: session.url,
    });
  } catch (error) {
    console.error("[stripe] create-checkout-session error", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Checkout Session." },
      { status: 500 }
    );
  }
}
