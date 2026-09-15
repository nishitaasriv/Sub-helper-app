import { Link, useLocation } from "@tanstack/react-router";
import { Bell, CheckCircle2, LayoutDashboard, List, Plus, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/subscriptions";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/subscriptions", label: "My Subscriptions", icon: List },
  { to: "/add", label: "Add Subscription", icon: Plus },
  { to: "/cancellation", label: "Cancellation", icon: ShieldCheck },
];

export function AppShell({ children, subscriptions = [], reminderCount = 0 }) {
  const location = useLocation();
  const totalMonthly = subscriptions.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const activePath = location.pathname;
  return (
    <div className="min-h-screen bg-background text-foreground font-body antialiased">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface/40 px-5 py-6 md:flex">
          <Link to="/" className="flex items-center gap-2.5 px-1" aria-label="SubTrack AI home">
            <span className="grid size-9 place-items-center rounded-lg bg-primary font-display text-xl text-primary-foreground">S</span>
            <span><span className="block font-display text-lg leading-none tracking-wide">SubTrack AI</span><span className="mt-1 block font-mono text-[10px] tracking-widest text-muted-foreground">RECURRING SPEND</span></span>
          </Link>
          <nav className="mt-9 space-y-1" aria-label="Primary navigation">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active = to === "/" ? activePath === "/" : activePath.startsWith(to);
              return <Link key={to} to={to} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${active ? "bg-primary/15 font-medium text-foreground ring-1 ring-primary/30" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}><Icon className="size-4" />{label}</Link>;
            })}
          </nav>
          <div className="mt-auto pt-6">
            <div className="rounded-lg border border-border bg-surface-2/60 p-3.5">
              <div className="font-mono text-[10px] tracking-widest text-muted-foreground">YEARLY PROJECTION</div>
              <div className="mt-1 font-display text-3xl">{formatCurrency(totalMonthly * 12)}</div>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-border"><div className="h-full w-[38%] bg-gradient-to-r from-primary to-accent" /></div>
              <div className="mt-2 font-mono text-[10px] text-muted-foreground">stored in this browser</div>
            </div>
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-border bg-background/90 px-4 py-3.5 backdrop-blur-md sm:px-6">
            <Link to="/" className="flex items-center gap-2 md:hidden"><span className="grid size-8 place-items-center rounded-lg bg-primary font-display text-lg text-primary-foreground">S</span><span className="font-display tracking-wide">SubTrack AI</span></Link>
            <div className="hidden items-center gap-2 rounded-full border border-border bg-surface-2/50 px-3.5 py-2 text-sm text-muted-foreground md:flex"><span>/</span> Track your recurring spend</div>
            <div className="ml-auto flex items-center gap-3"><div className="relative grid size-9 place-items-center rounded-lg border border-border text-muted-foreground" aria-label={`${reminderCount} reminders`}><Bell className="size-4" />{reminderCount > 0 && <span className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[9px] text-accent-foreground">{reminderCount}</span>}</div><Button asChild size="sm"><Link to="/add"><Plus /> <span className="hidden sm:inline">Add </span>Subscription</Link></Button></div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="mt-2 border-t border-border px-4 py-5 sm:px-6"><div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] tracking-widest text-muted-foreground"><span>© 2026 SUBTRACK AI</span><span>DATA STORED LOCALLY</span><span>IN-APP REMINDERS ONLY</span><span className="sm:ml-auto">V0.1 · STUDENT PROTOTYPE</span></div></footer>
        </div>
      </div>
    </div>
  );
}

export function PageIntro({ eyebrow, title, description, action }) {
  return <section className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5"><div><div className="font-mono text-[11px] tracking-[0.2em] text-primary">{eyebrow}</div><h1 className="mt-1 font-display text-5xl leading-none tracking-wide sm:text-6xl">{title}</h1>{description && <p className="mt-2 max-w-[58ch] text-sm text-muted-foreground">{description}</p>}</div>{action}</section>;
}

export function ReminderBadge({ subscription }) {
  const reminder = subscription?.reminder || { label: "Active", tone: "positive" };
  const toneClasses = { critical: "bg-critical/10 text-critical ring-critical/25", warning: "bg-warning/10 text-warning ring-warning/25", primary: "bg-primary/10 text-primary ring-primary/25", positive: "bg-positive/10 text-positive ring-positive/25", muted: "bg-muted text-muted-foreground ring-border" };
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wider ring-1 ${toneClasses[reminder.tone] || toneClasses.muted}`}><span className="size-1.5 rounded-full bg-current" />{reminder.label.toUpperCase()}</span>;
}

export function EmptyState({ title = "No subscriptions yet", description = "Add your first subscription to start tracking renewals." }) { return <div className="grid min-h-64 place-items-center rounded-xl border border-dashed border-border bg-surface/50 p-8 text-center"><div><div className="mx-auto grid size-10 place-items-center rounded-lg bg-primary/15 text-primary"><CheckCircle2 className="size-5" /></div><h2 className="mt-3 font-display text-2xl tracking-wide">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{description}</p></div></div>; }

export function ConfirmationModal({ title, description, onConfirm, onCancel }) { return <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-xl border border-border bg-surface p-5 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><h2 className="font-display text-2xl tracking-wide">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{description}</p></div><Button variant="ghost" size="icon" onClick={onCancel} aria-label="Close confirmation"><X /></Button></div><div className="mt-5 flex justify-end gap-2"><Button variant="outline" onClick={onCancel}>Keep it</Button><Button variant="destructive" onClick={onConfirm}>Delete subscription</Button></div></div></div>; }
