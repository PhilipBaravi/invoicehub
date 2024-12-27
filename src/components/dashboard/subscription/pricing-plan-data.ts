import { PricingPlan } from "./types";

export const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    price: 0,
    description:
      "Perfect for small businesses or freelancers just starting out",
    features: [
      {
        text: "Manage up to 50 Employees, Clients, and Products each",
        included: true,
      },
      { text: "Create up to 25 invoices per month", included: true },
      { text: "Track payments for up to 25 invoices monthly", included: true },
      {
        text: "Access to advanced interactive data charts",
        included: true,
        tooltip: "Full access to our advanced charting capabilities",
      },
      { text: "Basic AI assistant (10 queries/month)", included: true },
      { text: "Unlimited entries and invoices", included: false },
      { text: "Full AI integration", included: false },
      { text: "Priority support", included: false },
    ],
    highlightFeature: "Great for testing the waters",
  },
  {
    name: "Starter",
    price: 5,
    description: "Ideal for growing businesses needing more flexibility",
    features: [
      { text: "Unlimited Employees, Clients, and Products", included: true },
      { text: "Unlimited invoices and payment tracking", included: true },
      {
        text: "Advanced interactive data charts with custom filters",
        included: true,
      },
      { text: "Enhanced AI assistant (50 queries/month)", included: true },
      { text: "Basic email support", included: true },
      { text: "Data export capabilities", included: true },
      { text: "Full AI integration", included: false },
      { text: "Priority support", included: false },
    ],
    highlightFeature: "No limits on core features",
  },
  {
    name: "Pro",
    price: 15,
    description:
      "For businesses seeking advanced features and dedicated support",
    popular: true,
    features: [
      { text: "All Starter features, plus:", included: true },
      { text: "Unlimited AI assistant usage", included: true },
      { text: "Full AI integration with all app features", included: true },
      { text: "Advanced AI insights and task automation", included: true },
      {
        text: "Priority support with dedicated account manager",
        included: true,
      },
      { text: "Custom report generation", included: true },
      { text: "API access for third-party integrations", included: true },
      { text: "Early access to new features", included: true },
    ],
    highlightFeature: "Unlock the full power of AI",
  },
];
