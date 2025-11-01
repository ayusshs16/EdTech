import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ensureStripe } from "@/configs/stripe";
import {
  deleteSubscriptionRecord,
  saveSubscriptionRecord,
} from "@/configs/stripeStore";

export const runtime = "nodejs";

export async function POST(req) {
  const stripe = ensureStripe();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe-Signature header" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const payload = await req.text();

  let event;

  try {
    event = webhookSecret
      ? stripe.webhooks.constructEvent(payload, signature, webhookSecret)
      : stripe.webhooks.constructEvent(payload, signature);
  } catch (error) {
    console.error("[stripe] webhook signature verification failed", error);
    return new NextResponse(`Webhook Error: ${error.message}`, {
      status: 400,
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription,
            {
              expand: ["items.data.price.product"],
            }
          );
          saveSubscriptionRecord(subscription);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        saveSubscriptionRecord(event.data.object);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        deleteSubscriptionRecord(subscription.id);
        break;
      }
      default: {
        console.log(`[stripe] Unhandled event type: ${event.type}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[stripe] webhook handler error", error);
    return NextResponse.json(
      { error: error.message || "Failed to process webhook" },
      { status: 500 }
    );
  }
}
