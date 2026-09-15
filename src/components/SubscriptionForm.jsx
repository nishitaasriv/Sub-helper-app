import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CATEGORIES, BILLING_CYCLES, addSubscription, updateSubscription } from "@/lib/subscriptions";

const emptyForm = { name: "", category: "Entertainment", price: "", currency: "₹", billingCycle: "Monthly", startDate: "", nextRenewalDate: "", isTrial: false, trialEndDate: "", cancellationUrl: "", notes: "" };

export function SubscriptionForm({ subscription }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(subscription || emptyForm);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Enter a subscription name.";
    if (!form.price || Number(form.price) <= 0) next.price = "Price must be greater than zero.";
    if (!form.startDate) next.startDate = "Choose a valid start date.";
    if (!form.nextRenewalDate) next.nextRenewalDate = "Choose the next renewal date.";
    if (form.startDate && form.nextRenewalDate && form.nextRenewalDate < form.startDate) next.nextRenewalDate = "Renewal date cannot be before the start date.";
    if (form.isTrial && !form.trialEndDate) next.trialEndDate = "Choose when the trial ends.";
    if (form.isTrial && form.trialEndDate && form.startDate && form.trialEndDate < form.startDate) next.trialEndDate = "Trial end cannot be before the start date.";
    if (form.cancellationUrl && !/^https?:\/\//i.test(form.cancellationUrl)) next.cancellationUrl = "Use a complete URL beginning with https://.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    if (subscription) updateSubscription(form); else addSubscription(form);
    setSaved(true);
    window.setTimeout(() => navigate({ to: "/subscriptions" }), 650);
  };
  const field = (label, key, type = "text", placeholder = "") => <label className="block space-y-2 text-sm"><span className="font-medium text-foreground">{label}</span><input type={type} value={form[key]} placeholder={placeholder} onChange={(event) => update(key, event.target.value)} className={`w-full rounded-lg border bg-surface-2/50 px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors[key] ? "border-critical" : "border-input"}`} />{errors[key] && <span className="text-xs text-critical">{errors[key]}</span>}</label>;
  return <form onSubmit={handleSubmit} className="space-y-6">
    {saved && <div role="status" className="rounded-lg border border-positive/30 bg-positive/10 px-4 py-3 text-sm text-positive">Subscription saved. Opening My Subscriptions…</div>}
    <div className="grid gap-5 md:grid-cols-2">
      {field("Subscription name *", "name", "text", "e.g. Netflix")}
      <label className="block space-y-2 text-sm"><span className="font-medium">Category *</span><select value={form.category} onChange={(event) => update("category", event.target.value)} className="w-full rounded-lg border border-input bg-surface-2/50 px-3 py-2.5 text-sm outline-none focus:border-primary">{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label>
      <div className="grid grid-cols-[1fr_88px] gap-3">{field("Price *", "price", "number", "0.00")}<label className="block space-y-2 text-sm"><span className="font-medium">Currency</span><select value={form.currency} onChange={(event) => update("currency", event.target.value)} className="w-full rounded-lg border border-input bg-surface-2/50 px-3 py-2.5 text-sm outline-none focus:border-primary"><option>₹</option><option>$</option><option>€</option></select></label></div>
      <label className="block space-y-2 text-sm"><span className="font-medium">Billing cycle *</span><select value={form.billingCycle} onChange={(event) => update("billingCycle", event.target.value)} className="w-full rounded-lg border border-input bg-surface-2/50 px-3 py-2.5 text-sm outline-none focus:border-primary">{BILLING_CYCLES.map((cycle) => <option key={cycle}>{cycle}</option>)}</select></label>
      {field("Start date *", "startDate", "date")}
      {field("Next renewal date *", "nextRenewalDate", "date")}
    </div>
    <div className="rounded-lg border border-border bg-surface/70 p-4"><label className="flex cursor-pointer items-center gap-3 text-sm"><input type="checkbox" checked={form.isTrial} onChange={(event) => update("isTrial", event.target.checked)} className="size-4 accent-primary" /><span><span className="block font-medium">This is a free trial</span><span className="text-xs text-muted-foreground">Show a reminder before the trial converts.</span></span></label>{form.isTrial && <div className="mt-4 max-w-sm">{field("Trial end date *", "trialEndDate", "date")}</div>}</div>
    <div className="grid gap-5 md:grid-cols-2"><div className="md:col-span-2">{field("Cancellation URL", "cancellationUrl", "url", "https://provider.com/account")}</div><label className="block space-y-2 text-sm md:col-span-2"><span className="font-medium">Notes</span><textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} rows={4} placeholder="Add a helpful note about this plan" className="w-full resize-none rounded-lg border border-input bg-surface-2/50 px-3 py-2.5 text-sm outline-none focus:border-primary" /></label></div>
    <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-5"><Button asChild variant="outline"><Link to="/subscriptions">Cancel</Link></Button><Button type="submit">{subscription ? "Save changes" : "Add Subscription"}</Button></div>
  </form>;
}
