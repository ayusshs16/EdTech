import { NextResponse } from "next/server";
import { ensureStripe } from "@/configs/stripe";
import { deleteSubscriptionRecord, saveSubscriptionRecord } from "@/configs/stripeStore";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { subscriptionId, invoiceNow } = body || {};

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "subscriptionId is required." },
        { status: 400 }
      );
    }

      const stripe = ensureStripe();

      const canceled = await stripe.subscriptions.del(subscriptionId, {
        invoice_now: Boolean(invoiceNow),
      });

    deleteSubscriptionRecord(subscriptionId);
    // Persist latest subscription payload for audit/logging purposes
    saveSubscriptionRecord(canceled);

    return NextResponse.json({ subscription: canceled });
  } catch (error) {
    console.error("[stripe] cancel-subscription error", error);
    return NextResponse.json(
      { error: error.message || "Failed to cancel subscription." },
      { status: 500 }
    );
  }
}
