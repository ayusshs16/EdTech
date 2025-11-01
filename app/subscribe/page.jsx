"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const DEFAULT_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || "";

const initialAddressState = {
  line1: "27 Fredrick Ave",
  line2: "",
  city: "Brothers",
  state: "CA",
  postalCode: "97712",
  country: "US",
};

const cleanAddressPayload = (address) => {
  return Object.fromEntries(
    Object.entries(address).filter(([, value]) => value && value.trim() !== "")
  );
};

const destroyStripeElement = (element) => {
  if (!element) return;
  if (typeof element.destroy === "function") {
    element.destroy();
  } else if (typeof element.unmount === "function") {
    element.unmount();
  }
};

const loadStoredCustomer = () => {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem("prepgen_stripe_customer");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn("Unable to parse stored Stripe customer", error);
    return null;
  }
};

export default function SubscribePage() {
  const [stripeReady, setStripeReady] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [customer, setCustomer] = useState(loadStoredCustomer);
  const [registerError, setRegisterError] = useState("");

  const [priceId, setPriceId] = useState(DEFAULT_PRICE_ID);
  const [startingCheckout, setStartingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [sessionDetails, setSessionDetails] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [confirmSuccess, setConfirmSuccess] = useState(null);
  const [subscriptionId, setSubscriptionId] = useState("");
  const [addressState, setAddressState] = useState(initialAddressState);

  const checkoutRef = useRef(null);
  const actionsRef = useRef(null);
  const paymentElementRef = useRef(null);
  const addressElementRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    stripePromise
      .then((instance) => {
        if (mounted && instance) {
          setStripeReady(true);
        }
      })
      .catch((error) => {
        console.error("Failed to load Stripe.js", error);
        setStripeReady(false);
      });

    return () => {
      mounted = false;
      destroyStripeElement(paymentElementRef.current);
      destroyStripeElement(addressElementRef.current);
      paymentElementRef.current = null;
      addressElementRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!customer?.customerId) return;
    setSubscriptionId((prev) => prev || "");
  }, [customer]);

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setRegisterError("");
    setConfirmSuccess(null);

    if (!stripeReady) {
      setRegisterError("Stripe.js failed to load. Reload the page and try again.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: formData.get("email"),
      name: formData.get("name") || undefined,
      address: cleanAddressPayload({
        line1: formData.get("line1"),
        line2: formData.get("line2"),
        city: formData.get("city"),
        state: formData.get("state"),
        postal_code: formData.get("postalCode"),
        country: formData.get("country"),
      }),
    };

    if (!payload.email) {
      setRegisterError("Please provide an email address.");
      return;
    }

    setRegistering(true);

    try {
      const response = await fetch("/api/stripe/create-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to create customer");
      }

      const customerData = {
        customerId: data.customerId,
        email: payload.email,
        name: payload.name,
        address: payload.address,
      };

      setCustomer(customerData);
      window.localStorage.setItem(
        "prepgen_stripe_customer",
        JSON.stringify(customerData)
      );
      toast.success("Stripe customer created", {
        description: `Customer ID: ${data.customerId}`,
      });
    } catch (error) {
      console.error("create-customer failed", error);
      setRegisterError(error.message || "Failed to create customer");
    } finally {
      setRegistering(false);
    }
  };

  const startCheckout = async () => {
    if (!stripeReady) {
      setCheckoutError("Stripe.js failed to load. Try refreshing the page.");
      return;
    }

    if (!customer?.customerId) {
      setCheckoutError("Create a customer before starting checkout.");
      return;
    }

    if (!priceId) {
      setCheckoutError(
        "Provide a Stripe Price ID or configure NEXT_PUBLIC_STRIPE_PRICE_ID."
      );
      return;
    }

  setCheckoutError("");
  setConfirmError("");
  setConfirmSuccess(null);
  setSessionDetails(null);
  setStartingCheckout(true);

  destroyStripeElement(paymentElementRef.current);
  destroyStripeElement(addressElementRef.current);
  paymentElementRef.current = null;
  addressElementRef.current = null;
  actionsRef.current = null;
  checkoutRef.current = null;

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customer.customerId,
          priceId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to create Checkout Session");
      }

      if (!data.clientSecret) {
        throw new Error(
          "Stripe did not return a client secret. Ensure ui_mode is set to 'custom'."
        );
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe instance is not available");
      }

      const checkout = await stripe.initCheckout({
        clientSecret: data.clientSecret,
      });
      checkoutRef.current = checkout;

      const loadActionsResult = await checkout.loadActions();

      if (loadActionsResult.type !== "success") {
        throw new Error(loadActionsResult.error?.message || "Checkout failed");
      }

      const { actions } = loadActionsResult;
      actionsRef.current = actions;

      const session = actions.getSession();
      setSessionDetails(session);

      const paymentElementContainer = document.getElementById("payment-element");
      if (paymentElementContainer) {
        paymentElementContainer.innerHTML = "";
        const paymentElement = checkout.createPaymentElement();
        paymentElement.mount(paymentElementContainer);
        paymentElementRef.current = paymentElement;
      }

      const addressElementContainer = document.getElementById("address-element");
      if (addressElementContainer) {
        addressElementContainer.innerHTML = "";
        const addressElement = checkout.createAddressElement({
          mode: "billing",
          defaultValues: {
            name: customer?.name,
            address: customer?.address,
          },
        });
        addressElement.mount(addressElementContainer);
        addressElementRef.current = addressElement;
      }

      if (session?.subscription) {
        setSubscriptionId(session.subscription);
      }

      toast.success("Checkout session ready", {
        description: `Session ID: ${data.sessionId}`,
      });
    } catch (error) {
      console.error("startCheckout error", error);
      setCheckoutError(error.message || "Failed to start checkout");
    } finally {
      setStartingCheckout(false);
    }
  };

  const confirmPayment = async () => {
    if (!actionsRef.current) {
      setConfirmError("Checkout actions not available. Start a session first.");
      return;
    }

    setConfirming(true);
    setConfirmError("");

    try {
      const result = await actionsRef.current.confirm();

      if (result.type === "error") {
        throw new Error(result.error?.message || "Unable to confirm payment");
      }

      if (result.type === "success") {
        const completedSession = result.session;
        setConfirmSuccess(completedSession);
        setSessionDetails(completedSession);
        if (completedSession?.subscription) {
          setSubscriptionId(completedSession.subscription);
        }
        toast.success("Subscription active", {
          description: completedSession.subscription,
        });
      }
    } catch (error) {
      console.error("confirmPayment error", error);
      setConfirmError(error.message || "Payment confirmation failed");
    } finally {
      setConfirming(false);
    }
  };

  const cancelSubscription = async (event) => {
    event.preventDefault();
    setConfirmError("");

    const subscription = event.currentTarget.subscriptionId.value.trim();
    if (!subscription) {
      setConfirmError("Provide a subscription ID to cancel.");
      return;
    }

    try {
      const response = await fetch("/api/stripe/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscriptionId: subscription }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to cancel subscription");
      }

      toast.success("Subscription cancelled", {
        description: subscription,
      });
      setConfirmSuccess(data.subscription);
    } catch (error) {
      console.error("cancelSubscription error", error);
      setConfirmError(error.message || "Failed to cancel subscription");
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10">
      <div>
        <h1 className="text-3xl font-bold">Stripe Subscription Demo</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Collect customer information, start a custom Stripe Checkout session,
          mount the Payment and Address Elements, confirm the payment, listen to
          webhooks, and cancel subscriptions. Replace the test keys with your
          own in <code>.env.local</code> when you are ready.
        </p>
      </div>

      <section className="rounded-lg border bg-background p-6 shadow-sm">
        <h2 className="text-xl font-semibold">1. Register customer</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Create a Stripe Customer and store the returned ID for later use.
        </p>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleRegisterSubmit}>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Email</span>
            <input
              name="email"
              type="email"
              defaultValue={customer?.email || "test@example.com"}
              required
              className="rounded-md border px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Name</span>
            <input
              name="name"
              type="text"
              placeholder="Customer name"
              defaultValue={customer?.name || "Test User"}
              className="rounded-md border px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Address line 1</span>
            <input
              name="line1"
              type="text"
              defaultValue={addressState.line1}
              onChange={(event) =>
                setAddressState((prev) => ({
                  ...prev,
                  line1: event.target.value,
                }))
              }
              className="rounded-md border px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Address line 2</span>
            <input
              name="line2"
              type="text"
              defaultValue={addressState.line2}
              onChange={(event) =>
                setAddressState((prev) => ({
                  ...prev,
                  line2: event.target.value,
                }))
              }
              className="rounded-md border px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">City</span>
            <input
              name="city"
              type="text"
              defaultValue={addressState.city}
              onChange={(event) =>
                setAddressState((prev) => ({
                  ...prev,
                  city: event.target.value,
                }))
              }
              className="rounded-md border px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">State / Province</span>
            <input
              name="state"
              type="text"
              defaultValue={addressState.state}
              onChange={(event) =>
                setAddressState((prev) => ({
                  ...prev,
                  state: event.target.value,
                }))
              }
              className="rounded-md border px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Postal code</span>
            <input
              name="postalCode"
              type="text"
              defaultValue={addressState.postalCode}
              onChange={(event) =>
                setAddressState((prev) => ({
                  ...prev,
                  postalCode: event.target.value,
                }))
              }
              className="rounded-md border px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Country</span>
            <input
              name="country"
              type="text"
              defaultValue={addressState.country}
              onChange={(event) =>
                setAddressState((prev) => ({
                  ...prev,
                  country: event.target.value,
                }))
              }
              placeholder="US"
              className="rounded-md border px-3 py-2"
            />
          </label>

          <div className="flex items-end gap-3">
            <button
              type="submit"
              className={cn(
                "rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white",
                registering && "opacity-70"
              )}
              disabled={registering}
            >
              {registering ? "Creating customer..." : "Create Stripe customer"}
            </button>

            {customer?.customerId && (
              <span className="text-xs text-muted-foreground">
                Saved customer ID: <code>{customer.customerId}</code>
              </span>
            )}
          </div>
        </form>

        {registerError && (
          <p className="mt-3 text-sm text-red-600">{registerError}</p>
        )}
      </section>

      <section className="rounded-lg border bg-background p-6 shadow-sm">
        <h2 className="text-xl font-semibold">2. Start Checkout</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Build a custom payment flow using `stripe.initCheckout`, the
          Payment Element, and the Address Element.
        </p>

        <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Stripe Price ID</span>
              <input
                value={priceId}
                onChange={(event) => setPriceId(event.target.value)}
                placeholder="price_..."
                className="rounded-md border px-3 py-2"
              />
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className={cn(
                  "rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white",
                  startingCheckout && "opacity-70"
                )}
                onClick={startCheckout}
                disabled={startingCheckout}
              >
                {startingCheckout ? "Preparing checkout..." : "Create checkout session"}
              </button>
              <button
                type="button"
                className="rounded-md border px-4 py-2 text-sm"
                onClick={() => {
                  destroyStripeElement(paymentElementRef.current);
                  destroyStripeElement(addressElementRef.current);
                  paymentElementRef.current = null;
                  addressElementRef.current = null;
                  actionsRef.current = null;
                  checkoutRef.current = null;
                  setSessionDetails(null);
                  setConfirmError("");
                  setConfirmSuccess(null);
                }}
              >
                Reset session
              </button>
            </div>

            {checkoutError && (
              <p className="text-sm text-red-600">{checkoutError}</p>
            )}

            {sessionDetails && (
              <div className="rounded-md border bg-muted/50 p-4 text-sm">
                <h3 className="font-semibold">Session preview</h3>
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs">
                  {JSON.stringify(sessionDetails.lineItems, null, 2)}
                </pre>
                {sessionDetails?.total?.total?.amount && (
                  <p className="mt-2">
                    Total amount: {sessionDetails.total.total.amount} {
                      sessionDetails.total.total.currency
                    }
                  </p>
                )}
              </div>
            )}

            <div className="rounded-md border bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">
                Address Element
              </h3>
              <div id="address-element" className="min-h-[150px]"></div>
            </div>

            <div className="rounded-md border bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">
                Payment Element
              </h3>
              <div id="payment-element" className="min-h-[150px]"></div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={confirmPayment}
                className={cn(
                  "rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white",
                  confirming && "opacity-70"
                )}
                disabled={confirming || !actionsRef.current}
              >
                {confirming ? "Confirming..." : "Pay & activate subscription"}
              </button>
              {confirmError && (
                <p id="confirm-errors" className="text-sm text-red-600">
                  {confirmError}
                </p>
              )}
              {confirmSuccess && (
                <p className="text-sm text-emerald-600">
                  Subscription active. ID: {confirmSuccess.subscription || subscriptionId}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-md border bg-muted/40 p-4 text-sm">
            <h3 className="font-semibold">Status</h3>
            <dl className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between gap-3">
                <dt className="font-medium">Stripe loaded</dt>
                <dd>{stripeReady ? "Yes" : "No"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="font-medium">Customer ID</dt>
                <dd>{customer?.customerId || "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="font-medium">Subscription ID</dt>
                <dd>{subscriptionId || "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="font-medium">Checkout ready</dt>
                <dd>{actionsRef.current ? "Yes" : "No"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="rounded-lg border bg-background p-6 shadow-sm">
        <h2 className="text-xl font-semibold">3. Cancel subscription</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Use the manual cancellation flow to test subscription webhooks and
          revoking access in your application.
        </p>

        <form className="flex flex-col gap-3 md:flex-row" onSubmit={cancelSubscription}>
          <input
            name="subscriptionId"
            defaultValue={subscriptionId}
            placeholder="sub_..."
            className="flex-1 rounded-md border px-3 py-2"
          />
          <button
            type="submit"
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Cancel subscription
          </button>
        </form>

        <p className="mt-3 text-xs text-muted-foreground">
          Tip: run <code>stripe listen --forward-to localhost:3000/api/stripe/webhook</code>
          in another terminal while developing to inspect events locally.
        </p>
      </section>
    </div>
  );
}
