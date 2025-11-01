// Lightweight in-memory store for Stripe entities. This keeps the sample
// self-contained; swap with your database in production deployments.

const customerStore = new Map();
const subscriptionStore = new Map();

export const saveCustomerRecord = ({
  customerId,
  email,
  name,
  address,
}) => {
  if (!customerId) return;

  customerStore.set(customerId, {
    customerId,
    email,
    name,
    address,
    createdAt: Date.now(),
  });
};

export const getCustomerRecord = (customerId) => {
  return customerStore.get(customerId) || null;
};

export const saveSubscriptionRecord = (subscription) => {
  if (!subscription?.id) return;

  subscriptionStore.set(subscription.id, {
    id: subscription.id,
    status: subscription.status,
    customer: subscription.customer,
    items: subscription.items,
    price: subscription.items?.data?.[0]?.price?.id,
    product: subscription.items?.data?.[0]?.price?.product,
    currentPeriodEnd: subscription.current_period_end,
    currentPeriodStart: subscription.current_period_start,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    raw: subscription,
    updatedAt: Date.now(),
  });
};

export const deleteSubscriptionRecord = (subscriptionId) => {
  subscriptionStore.delete(subscriptionId);
};

export const listSubscriptions = () => {
  return Array.from(subscriptionStore.values());
};
