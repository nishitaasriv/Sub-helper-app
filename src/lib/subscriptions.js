export const STORAGE_KEY = "subtrack_subscriptions";

export const DEMO_SUBSCRIPTIONS = [
  { id: "demo-netflix", name: "Netflix", category: "Entertainment", price: 649, currency: "₹", billingCycle: "Monthly", startDate: "2025-01-05", nextRenewalDate: "2025-02-05", isTrial: false, trialEndDate: "", cancellationUrl: "https://www.netflix.com/cancelplan", notes: "Standard entertainment plan." },
  { id: "demo-spotify", name: "Spotify", category: "Music", price: 119, currency: "₹", billingCycle: "Monthly", startDate: "2025-01-12", nextRenewalDate: "2025-02-12", isTrial: false, trialEndDate: "", cancellationUrl: "https://www.spotify.com/account/subscription/", notes: "Individual music plan." },
  { id: "demo-canva", name: "Canva", category: "Productivity", price: 499, currency: "₹", billingCycle: "Monthly", startDate: "2025-01-17", nextRenewalDate: "2025-02-17", isTrial: true, trialEndDate: "2025-01-24", cancellationUrl: "https://www.canva.com/settings/billing", notes: "Trial converts to monthly plan." },
  { id: "demo-amazon", name: "Amazon Prime", category: "Shopping", price: 1499, currency: "₹", billingCycle: "Yearly", startDate: "2025-01-25", nextRenewalDate: "2026-01-25", isTrial: false, trialEndDate: "", cancellationUrl: "https://www.amazon.in/gp/subs/primeclub/account/homepage.html", notes: "Annual membership." },
];

export const CATEGORIES = ["Entertainment", "Music", "Productivity", "Education", "Shopping", "Fitness", "Software", "Other"];
export const BILLING_CYCLES = ["Monthly", "Yearly", "Weekly"];

export function readSubscriptions() {
  if (typeof window === "undefined") return DEMO_SUBSCRIPTIONS;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_SUBSCRIPTIONS));
    return DEMO_SUBSCRIPTIONS;
  }
  try { return JSON.parse(stored); } catch { return []; }
}

export function saveSubscriptions(subscriptions) {
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
  return subscriptions;
}

export function addSubscription(subscription) {
  return saveSubscriptions([...readSubscriptions(), { ...subscription, id: crypto.randomUUID() }]);
}

export function updateSubscription(subscription) {
  return saveSubscriptions(readSubscriptions().map((item) => item.id === subscription.id ? subscription : item));
}

export function deleteSubscription(id) {
  return saveSubscriptions(readSubscriptions().filter((item) => item.id !== id));
}

export function monthlyCost(subscription) {
  const price = Number(subscription.price) || 0;
  if (subscription.billingCycle === "Yearly") return price / 12;
  if (subscription.billingCycle === "Weekly") return price * 52 / 12;
  return price;
}

export function yearlyCost(subscription) {
  const price = Number(subscription.price) || 0;
  if (subscription.billingCycle === "Yearly") return price;
  if (subscription.billingCycle === "Weekly") return price * 52;
  return price * 12;
}

export function daysUntil(dateValue, now = new Date()) {
  if (!dateValue) return null;
  const target = new Date(`${dateValue}T00:00:00`);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.ceil((target - today) / 86400000);
}

export function reminderStatus(subscription, now = new Date()) {
  const renewalDays = daysUntil(subscription.nextRenewalDate, now);
  const trialDays = subscription.isTrial ? daysUntil(subscription.trialEndDate, now) : null;
  if (subscription.isTrial && trialDays !== null && trialDays < 0) return { label: "Trial ended", tone: "critical", kind: "trial-ended", days: trialDays };
  if (subscription.isTrial && trialDays !== null && trialDays <= 7) return { label: trialDays === 0 ? "Trial ends today" : `Trial in ${trialDays}d`, tone: "critical", kind: "trial", days: trialDays };
  if (renewalDays !== null && renewalDays < 0) return { label: "Expired", tone: "muted", kind: "expired", days: renewalDays };
  if (renewalDays === 0) return { label: "Due today", tone: "critical", kind: "renewal", days: renewalDays };
  if (renewalDays <= 3) return { label: `Renew ${renewalDays}d`, tone: "warning", kind: "renewal", days: renewalDays };
  if (renewalDays <= 7) return { label: `Renew ${renewalDays}d`, tone: "primary", kind: "renewal", days: renewalDays };
  return { label: "Active", tone: "positive", kind: "active", days: renewalDays };
}

export function formatDate(dateValue) {
  if (!dateValue) return "Not set";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${dateValue}T00:00:00`));
}

export function formatCurrency(value) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}
