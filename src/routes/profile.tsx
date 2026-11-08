import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState, type CSSProperties } from "react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Camera, ChevronRight, Coffee, GraduationCap, HeartPulse, Wallet, Trophy, Sparkles, Users, Heart, Medal, Lock, Check, Mail, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ASSESSMENTS, AWARDS, BENEFITS, DIMENSIONS, EMPLOYEE, FORMDER_CLASSES, MILESTONES,
  classProgress, dimensionScore, formatTenure, tenureMonths, type Award, type Benefit, type Dimension,
} from "@/lib/profile";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Professional Profile — FORM Portal" },
      { name: "description", content: "Your professional identity, competencies, FORMder Class, benefits and recognition at FORM." },
      { property: "og:title", content: "My Professional Profile — FORM Portal" },
      { property: "og:description", content: "Professional identity, competencies, FORMder Class and recognition." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

const classStyle = (v: string) => ({ "--c": `var(${v})` }) as CSSProperties;

function ProfilePage() {
  const months = tenureMonths(EMPLOYEE.startDate, new Date());
  const prog = classProgress(months);
  const latest = ASSESSMENTS[0];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-bold tracking-tight text-primary">FORM</span>
            <span className="text-sm text-muted-foreground">Portal</span>
          </div>
          <span className="rounded-full bg-warning/15 px-3 py-1 text-xs font-medium text-foreground">Preview · sample data</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <div>
          <p className="eyebrow">My Professional Profile</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">Professional identity</h1>
        </div>

        <IdentityCard months={months} className={`${prog.current.level} — ${prog.current.name}`} assessed={latest.date} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)]">
          <CompetencyCard />
          <ClassCard months={months} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <BenefitsCard />
          <AwardsCard />
        </div>

        <Timeline />
        <p className="pb-6 text-center text-xs text-muted-foreground">
          All figures shown are demonstration values. FORMder Class tenure thresholds are placeholders pending HR approval.
        </p>
      </main>
    </div>
  );
}

/* ---------------- Identity ---------------- */
function IdentityCard({ months, className, assessed }: { months: number; className: string; assessed: string }) {
  const [photo, setPhoto] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const onFile = (f?: File) => {
    if (!f || !["image/jpeg", "image/png", "image/webp"].includes(f.type)) return;
    setPhoto(URL.createObjectURL(f));
  };
  const initials = EMPLOYEE.fullName.split(" ").map((p) => p[0]).join("");

  return (
    <section className="surface flex flex-col gap-6 p-6 md:flex-row md:items-center">
      <div className="flex flex-1 items-center gap-5">
        <button
          onClick={() => input.current?.click()}
          className="group relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-xl bg-secondary sm:w-28"
          aria-label="Change profile photo"
        >
          {photo ? <img src={photo} alt={EMPLOYEE.fullName} className="h-full w-full object-cover" /> : (
            <span className="flex h-full w-full items-center justify-center font-display text-2xl font-semibold text-primary">{initials}</span>
          )}
          <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-primary/80 py-1 text-[10px] font-medium text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="h-3 w-3" /> Change
          </span>
        </button>
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold text-foreground">{EMPLOYEE.fullName} <span className="text-base font-normal text-muted-foreground">({EMPLOYEE.nickname})</span></h2>
          <p className="mt-1 font-medium text-foreground">{EMPLOYEE.position}</p>
          <p className="text-sm text-muted-foreground">{EMPLOYEE.department}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
            <span>ID {EMPLOYEE.id}</span>
            <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />Since {EMPLOYEE.startDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
            <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{EMPLOYEE.email}</span>
            <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-success" />{EMPLOYEE.status}</span>
          </div>
        </div>
      </div>
      <dl className="grid grid-cols-3 divide-x divide-border rounded-xl bg-secondary/60 md:w-[440px]">
        {[["Years of Service", formatTenure(months)], ["FORMder Class", className], ["Last Assessment", assessed]].map(([k, v]) => (
          <div key={k} className="px-4 py-3">
            <dt className="eyebrow !text-[10px]">{k}</dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ---------------- Competency ---------------- */
function CompetencyCard() {
  const [aid, setAid] = useState(ASSESSMENTS[0].id);
  const [compare, setCompare] = useState(false);
  const [open, setOpen] = useState<Dimension | null>(null);
  const idx = ASSESSMENTS.findIndex((a) => a.id === aid);
  const cur = ASSESSMENTS[idx];
  const prev = ASSESSMENTS[idx + 1];
  const data = useMemo(() => DIMENSIONS.map((d) => ({ key: d.key, name: d.name, short: d.short, current: cur.scores[d.key], previous: prev?.scores[d.key] })), [cur, prev]);

  return (
    <section className="surface p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Professional Competency</p>
          <h3 className="mt-1 text-lg font-semibold text-foreground">Competency overview</h3>
        </div>
        <div className="flex items-center gap-4">
          {prev && (
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <Switch checked={compare} onCheckedChange={setCompare} /> Compare
            </label>
          )}
          <Select value={aid} onValueChange={setAid}>
            <SelectTrigger className="h-9 w-[210px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {ASSESSMENTS.map((a) => <SelectItem key={a.id} value={a.id} className="text-xs">{a.label} · {a.date}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-2 grid gap-4 md:grid-cols-[1fr_220px]">
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} outerRadius="72%">
              <PolarGrid gridType="polygon" stroke="var(--border)" />
              <PolarAngleAxis dataKey="short" tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontWeight: 600 }} />
              <PolarRadiusAxis domain={[0, 5]} tickCount={6} tick={false} axisLine={false} />
              {compare && prev && (
                <Radar name={`Previous · ${prev.date}`} dataKey="previous" stroke="var(--muted-foreground)" strokeDasharray="4 4" fill="transparent" />
              )}
              <Radar
                name={`Current · ${cur.date}`} dataKey="current" stroke="var(--teal)" strokeWidth={2} fill="var(--teal)" fillOpacity={0.15}
                dot={{ r: 4, fill: "var(--teal)", cursor: "pointer" }}
                activeDot={{ r: 6, onClick: (_: unknown, p: { payload?: { key: string } }) => { const d = DIMENSIONS.find((x) => x.key === p.payload?.key); if (d) setOpen(d); } } as never}
              />
              <Tooltip content={({ payload }) => {
                const p = payload?.[0]?.payload as (typeof data)[number] | undefined;
                if (!p) return null;
                return (
                  <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
                    <p className="font-semibold text-foreground">{p.name}</p>
                    <p className="mt-1 text-muted-foreground"><span className="font-semibold text-teal">{p.current.toFixed(1)}</span> / 5.0 · {cur.date}</p>
                  </div>
                );
              }} />
              {compare && prev && <Legend wrapperStyle={{ fontSize: 11 }} />}
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <ul className="space-y-1 self-center">
          {data.map((d) => (
            <li key={d.key}>
              <button onClick={() => setOpen(DIMENSIONS.find((x) => x.key === d.key)!)} className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs transition-colors hover:bg-secondary">
                <span className="text-foreground">{d.name}</span>
                <span className="flex items-center gap-1 font-display font-semibold text-teal">{d.current.toFixed(1)}<ChevronRight className="h-3 w-3 text-muted-foreground" /></span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">Status: {cur.status} · Only finalized assessments count toward the official chart.</p>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          {open && (
            <>
              <DialogHeader>
                <p className="eyebrow">Competency detail</p>
                <DialogTitle className="font-display text-xl">{open.name}</DialogTitle>
                <DialogDescription>{open.description}</DialogDescription>
              </DialogHeader>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-semibold text-teal">{(dimensionScore(open.criteria) ?? 0).toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">/ 5.0 · latest finalized</span>
              </div>
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-xs">
                  <thead className="bg-secondary text-left text-muted-foreground">
                    <tr><th className="px-3 py-2">Criterion</th><th className="px-3 py-2">Weight</th><th className="px-3 py-2 text-right">Score</th></tr>
                  </thead>
                  <tbody>
                    {open.criteria.map((c) => (
                      <tr key={c.id} className="border-t border-border">
                        <td className="px-3 py-2"><span className="text-muted-foreground">{c.id}</span> {c.name}<div className="text-[11px] text-muted-foreground">Evidence: {c.evidence}</div></td>
                        <td className="px-3 py-2">{c.weight}</td>
                        <td className="px-3 py-2 text-right font-semibold">{c.score === null ? <span className="font-normal text-muted-foreground">N/A</span> : c.score.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid gap-4 text-sm sm:grid-cols-2">
                <Detail label="Strengths" text={open.strengths} />
                <Detail label="Development opportunities" text={open.opportunities} />
                <Detail label="Assessor comments" text={open.comments} />
                <div>
                  <p className="eyebrow">Recommended actions</p>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-foreground">{open.actions.map((a) => <li key={a}>{a}</li>)}</ul>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function Detail({ label, text }: { label: string; text: string }) {
  return <div><p className="eyebrow">{label}</p><p className="mt-1 text-foreground">{text}</p></div>;
}

/* ---------------- FORMder Class ---------------- */
function ClassCard({ months }: { months: number }) {
  const [open, setOpen] = useState(false);
  const p = classProgress(months);
  const achieved = new Date(EMPLOYEE.startDate);
  achieved.setFullYear(achieved.getFullYear() + p.current.minYears);

  return (
    <section className="surface relative overflow-hidden p-6" style={classStyle(p.current.colorVar)}>
      <div className="absolute inset-x-0 top-0 h-1 bg-[var(--c)]" />
      <p className="eyebrow">FORMder Class</p>
      <button onClick={() => setOpen(true)} className="mx-auto mt-4 block transition-transform hover:scale-[1.03]" aria-label="View all FORMder classes">
        <img src={p.current.badge} alt={`${p.current.level} ${p.current.name} badge`} className="mx-auto h-44 w-auto object-contain" />
      </button>
      <div className="mt-3 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--c)]">{p.current.level}</p>
        <h3 className="text-xl font-semibold text-foreground">{p.current.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground">Achieved {achieved.toLocaleDateString("en-GB", { month: "short", year: "numeric" })} · {formatTenure(months)} of service</p>
      </div>
      <div className="mt-6">
        {p.next ? (
          <>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Toward {p.next.level} — {p.next.name}</span>
              <span className="font-semibold text-foreground">{p.percent}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-[var(--c)]" style={{ width: `${p.percent}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Next milestone: <span className="font-medium text-foreground">{formatTenure(p.remainingMonths)} remaining</span> · requires {p.next.minYears} years</p>
          </>
        ) : (
          <p className="text-center text-sm font-semibold text-[var(--c)]">Ultimate Class Achieved</p>
        )}
      </div>
      <button onClick={() => setOpen(true)} className="mt-5 w-full rounded-lg border border-border py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary">View class progression</button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <p className="eyebrow">Tenure-based recognition</p>
            <DialogTitle className="font-display text-xl">FORMder Class progression</DialogTitle>
            <DialogDescription>Separate from job position, competency, performance rating and salary grade.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-4">
            {FORMDER_CLASSES.map((c, i) => {
              const status = i < p.index ? "Completed" : i === p.index ? "Current" : "Locked";
              return (
                <div key={c.id} style={classStyle(c.colorVar)} className={`rounded-xl border p-3 text-center ${status === "Current" ? "border-[var(--c)] bg-secondary/50" : "border-border"}`}>
                  <img src={c.badge} alt={`${c.level} ${c.name} badge`} className={`mx-auto h-28 w-auto object-contain ${status === "Locked" ? "opacity-40 grayscale" : ""}`} />
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[var(--c)]">{c.level}</p>
                  <p className="text-sm font-semibold text-foreground">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.maxYears ? `${c.minYears}–${c.maxYears} yrs` : `${c.minYears}+ yrs`}</p>
                  <p className="mt-2 text-[11px] leading-snug text-muted-foreground">{c.description}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-foreground">
                    {status === "Completed" && <Check className="h-3 w-3 text-success" />}
                    {status === "Locked" && <Lock className="h-3 w-3 text-muted-foreground" />}
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

/* ---------------- Benefits ---------------- */
const benefitIcon: Record<string, typeof Coffee> = { starbucks: Coffee, credit: Wallet, learning: GraduationCap, health: HeartPulse };
const fmt = (n: number, unit?: string) => (unit === "THB" ? `THB ${n.toLocaleString()}` : `${n} ${unit ?? ""}`);

function BenefitsCard() {
  const [open, setOpen] = useState<Benefit | null>(null);
  return (
    <section className="surface p-6">
      <p className="eyebrow">Employee Benefits</p>
      <h3 className="mt-1 text-lg font-semibold text-foreground">My Benefits</h3>
      <div className="mt-4 space-y-3">
        {BENEFITS.map((b) => {
          const Icon = benefitIcon[b.id] ?? Wallet;
          const pct = b.total ? Math.round(((b.used ?? 0) / b.total) * 100) : null;
          return (
            <button key={b.id} onClick={() => setOpen(b)} className="flex w-full items-start gap-4 rounded-xl border border-border p-4 text-left transition-colors hover:bg-secondary/60">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-soft text-teal"><Icon className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">{b.name}</p>
                  <Badge variant="secondary" className="shrink-0 text-[10px]">{b.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{b.description}</p>
                <p className="mt-1 text-xs font-medium text-foreground">{b.value} <span className="font-normal text-muted-foreground">· {b.validity}</span></p>
                {pct !== null && (
                  <div className="mt-2">
                    <Progress value={pct} className="h-1" />
                    <p className="mt-1 text-[11px] text-muted-foreground">Remaining {fmt(b.total! - (b.used ?? 0), b.unit)}</p>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-lg">
          {open && (
            <>
              <DialogHeader>
                <p className="eyebrow">{open.category}</p>
                <DialogTitle className="font-display text-xl">{open.name}</DialogTitle>
                <DialogDescription>{open.description}</DialogDescription>
              </DialogHeader>
              {open.total && (
                <div className="grid grid-cols-3 gap-2 rounded-lg bg-secondary p-3 text-center text-xs">
                  {[["Entitlement", open.total], ["Used", open.used ?? 0], ["Remaining", open.total - (open.used ?? 0)]].map(([k, v]) => (
                    <div key={k as string}><p className="text-muted-foreground">{k}</p><p className="font-semibold text-foreground">{fmt(v as number, open.unit)}</p></div>
                  ))}
                </div>
              )}
              <div className="space-y-3 text-sm">
                <Detail label="Status" text={`${open.status} · ${open.validity}`} />
                <Detail label="Eligibility" text={open.eligibility} />
                <Detail label="How to claim" text={open.claim} />
                <Detail label="Terms & conditions" text={open.terms} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

/* ---------------- Awards ---------------- */
const awardIcon = { trophy: Trophy, spark: Sparkles, users: Users, heart: Heart, medal: Medal };

function AwardsCard() {
  const [open, setOpen] = useState<Award | null>(null);
  return (
    <section className="surface p-6">
      <p className="eyebrow">Recognition</p>
      <h3 className="mt-1 text-lg font-semibold text-foreground">Awards & Recognition</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {AWARDS.map((a) => {
          const Icon = awardIcon[a.icon];
          return (
            <button key={a.id} onClick={() => setOpen(a)} className="rounded-xl border border-border p-4 text-left transition-colors hover:bg-secondary/60">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground"><Icon className="h-4 w-4" /></span>
              <p className="mt-3 text-sm font-semibold text-foreground">{a.name}</p>
              <p className="text-[11px] text-muted-foreground">{a.category} · {a.date}</p>
              <p className="mt-1 text-xs text-muted-foreground">{a.description}</p>
            </button>
          );
        })}
      </div>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-lg">
          {open && (() => {
            const Icon = awardIcon[open.icon];
            return (
              <>
                <div className="flex justify-center rounded-xl bg-accent py-8">
                  <Icon className="h-16 w-16 text-accent-foreground" strokeWidth={1.25} />
                </div>
                <DialogHeader>
                  <p className="eyebrow">{open.category} · {open.visibility}</p>
                  <DialogTitle className="font-display text-xl">{open.name}</DialogTitle>
                  <DialogDescription>Awarded to {EMPLOYEE.fullName} on {open.date}</DialogDescription>
                </DialogHeader>
                <div className="space-y-3 text-sm">
                  <Detail label="Description" text={open.description} />
                  <Detail label="Reason for recognition" text={open.reason} />
                  <Detail label="Issued by" text={open.issuedBy} />
                  {open.project && <Detail label="Related project" text={open.project} />}
                  <Detail label="Supporting evidence" text={open.evidence} />
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </section>
  );
}

/* ---------------- Timeline ---------------- */
function Timeline() {
  return (
    <section className="surface p-6">
      <p className="eyebrow">Career Journey</p>
      <h3 className="mt-1 text-lg font-semibold text-foreground">Milestones & development history</h3>
      <ol className="relative mt-6 grid gap-6 md:grid-cols-6 md:gap-4">
        <div className="absolute left-[5px] top-0 h-full w-px bg-border md:left-0 md:top-[5px] md:h-px md:w-full" />
        {MILESTONES.map((m, i) => (
          <li key={i} className="relative pl-6 md:pl-0 md:pt-6">
            <span className={`absolute left-0 top-1 h-[11px] w-[11px] rounded-full border-2 border-card md:top-0 ${i === MILESTONES.length - 1 ? "bg-teal" : "bg-primary"}`} />
            <p className="text-[11px] font-semibold text-teal">{m.date}</p>
            <p className="text-sm font-semibold text-foreground">{m.title}</p>
            <p className="text-xs text-muted-foreground">{m.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
