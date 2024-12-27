export type PaymentMethod = {
  id: string;
  type: "credit" | "bank";
  last4: string;
  expiry?: string;
  name: string;
  isDefault: boolean;
};

export type PricingPlan = {
  name: string;
  price: number;
  description: string;
  features: {
    text: string;
    included: boolean;
    tooltip?: string;
  }[];
  popular?: boolean;
  highlightFeature?: string;
};
