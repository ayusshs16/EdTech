import { db } from "@/configs/db";
import { NextResponse } from "next/server";

// Webhook handler removed — payments are disabled. Keep stub to avoid 404s.
export async function POST() {
  return NextResponse.json({ error: "Payments disabled" }, { status: 410 });
}
        .set({
          isMember: true,
        })
        .where(eq(USER_TABLE.email, data.customer_details.email));
      break;
    case "invoice.paid":
      // Continue to provision the subscription as payments continue to be made.
      // Store the status in your database and check when a user accesses your service.
      // This approach helps you avoid hitting rate limits.
      await db.insert(PAYMENT_RECORD_TABLE).values({
        customerId: data.object.customer, // Stripe customer ID
        sessionId: data.object.subscription, // Stripe subscription ID
      });
      break;
    case "invoice.payment_failed":
      // The payment failed or the customer does not have a valid payment method.
      // The subscription becomes past_due. Notify your customer and send them to the
      // customer portal to update their payment information.
      await db
        .update(USER_TABLE)
        .set({
          isMember: false,
        })
        .where(eq(USER_TABLE.email, data.customer_details.email));
      break;
    default:
    // Unhandled event type
  }

  return NextResponse.json({ result: "success" });
}
