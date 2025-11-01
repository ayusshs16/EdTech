import Stripe from "stripe";

let stripeClient = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-10-29.clover",
  });
} else {
  console.warn(
    "[stripe] STRIPE_SECRET_KEY is not configured. Stripe API calls will fail until it is set."
  );
}

export const stripe = stripeClient;

export const ensureStripe = () => {
  if (!stripeClient) {
    throw new Error(
      "Stripe client not initialised. Set STRIPE_SECRET_KEY in your environment before calling Stripe APIs."
    );
  }

  return stripeClient;
};

export const getAppBaseUrl = () => {
  return (
    process.env.HOST_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  );
};
