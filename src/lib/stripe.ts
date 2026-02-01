import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe with publishable key
// This will be loaded from environment or platform settings
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";

let stripePromise: ReturnType<typeof loadStripe> | null = null;

export const getStripe = () => {
  if (!stripePromise && stripePublishableKey) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

// Subscription tier configuration
export const SUBSCRIPTION_TIERS: Record<string, {
  name: string;
  price: number;
  priceId: string | null;
  features: string[];
  limits: {
    savedProperties: number;
    emailAlerts: number;
    comparisons: number;
    dealPacks: number;
  };
}> = {
  free: {
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "Up to 10 saved properties",
      "Basic calculators",
      "Email alerts (5/month)",
      "Community access",
    ],
    limits: {
      savedProperties: 10,
      emailAlerts: 5,
      comparisons: 3,
      dealPacks: 1,
    },
  },
  pro: {
    name: "Pro",
    price: 29,
    priceId: "price_pro_monthly", // Replace with actual Stripe price ID
    features: [
      "Unlimited saved properties",
      "All calculators & scenarios",
      "Unlimited email alerts",
      "Deal Pack generator",
      "Property comparisons",
      "Pipeline management",
      "Priority support",
    ],
    limits: {
      savedProperties: -1, // unlimited
      emailAlerts: -1,
      comparisons: -1,
      dealPacks: 10,
    },
  },
  premium: {
    name: "Premium",
    price: 99,
    priceId: "price_premium_monthly", // Replace with actual Stripe price ID
    features: [
      "Everything in Pro",
      "STR Management tools",
      "Portfolio analytics",
      "API access",
      "White-label deal packs",
      "Dedicated account manager",
      "Custom integrations",
    ],
    limits: {
      savedProperties: -1,
      emailAlerts: -1,
      comparisons: -1,
      dealPacks: -1,
    },
  },
};

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

export const getTierFeatures = (tier: SubscriptionTier) => {
  return SUBSCRIPTION_TIERS[tier];
};

export const canAccessFeature = (
  userTier: SubscriptionTier,
  requiredTier: SubscriptionTier
): boolean => {
  const tierOrder: SubscriptionTier[] = ["free", "pro", "premium"];
  const userIndex = tierOrder.indexOf(userTier);
  const requiredIndex = tierOrder.indexOf(requiredTier);
  return userIndex >= requiredIndex;
};
