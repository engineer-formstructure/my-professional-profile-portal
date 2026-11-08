import elastic from "@/assets/Level_I_Elastic_Class.png.asset.json";
import yieldB from "@/assets/Level_II_Yield_Class.png.asset.json";
import plastic from "@/assets/Level_III_Plastic_Class.png.asset.json";
import ultimate from "@/assets/Level_IV_Ultimate_Class.png.asset.json";

/* ---------- Tenure ---------- */
export function tenureMonths(start: Date, now: Date): number {
  let m = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  if (now.getDate() < start.getDate()) m -= 1;
  return Math.max(0, m);
}
export function formatTenure(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts = [];
  if (y) parts.push(`${y} Year${y === 1 ? "" : "s"}`);
  if (m || !y) parts.push(`${m} Month${m === 1 ? "" : "s"}`);
  return parts.join(", ");
}

/* ---------- FORMder Class (placeholder thresholds — pending HR approval) ---------- */
export type FormderClass = {
  id: string;
  level: string;
  name: string;
  minYears: number;
  maxYears: number | null;
  badge: string;
  colorVar: string;
  description: string;
};
export const FORMDER_CLASSES: FormderClass[] = [
  { id: "elastic", level: "Level I", name: "Elastic Class", minYears: 0, maxYears: 2, badge: elastic.url, colorVar: "--class-elastic", description: "The first stage of the FORM journey — learning, adapting, and building foundations." },
  { id: "yield", level: "Level II", name: "Yield Class", minYears: 2, maxYears: 5, badge: yieldB.url, colorVar: "--class-yield", description: "The next stage of professional development — taking on load and growing in confidence." },
  { id: "plastic", level: "Level III", name: "Plastic Class", minYears: 5, maxYears: 10, badge: plastic.url, colorVar: "--class-plastic", description: "Advanced experience and professional maturity within FORM." },
  { id: "ultimate", level: "Level IV", name: "Ultimate Class", minYears: 10, maxYears: null, badge: ultimate.url, colorVar: "--class-ultimate", description: "The highest tenure-based FORMder class." },
];

export function classProgress(months: number, classes = FORMDER_CLASSES) {
  const years = months / 12;
  const idx = classes.findIndex((c) => years >= c.minYears && (c.maxYears === null || years < c.maxYears));
  const i = idx === -1 ? 0 : idx;
  const current = classes[i];
  const next = classes[i + 1] ?? null;
  if (!next) return { current, next: null, index: i, percent: 100, remainingMonths: 0 };
  const startM = current.minYears * 12;
  const endM = next.minYears * 12;
  const percent = Math.round(((months - startM) / (endM - startM)) * 100);
  return { current, next, index: i, percent, remainingMonths: endM - months };
}

/* ---------- Competency ---------- */
export type Criterion = { id: string; name: string; score: number | null; weight: number; assessor: string; evidence: string };
export function dimensionScore(criteria: Criterion[]): number | null {
  const applicable = criteria.filter((c) => c.score !== null); // N/A excluded, never zero
  const w = applicable.reduce((s, c) => s + c.weight, 0);
  if (!w) return null;
  return Math.round((applicable.reduce((s, c) => s + (c.score as number) * c.weight, 0) / w) * 10) / 10;
}

export type Dimension = {
  key: string;
  name: string;
  short: string;
  description: string;
  criteria: Criterion[];
  strengths: string;
  opportunities: string;
  comments: string;
  actions: string[];
};

const c = (id: string, name: string, score: number | null, weight: number, evidence: string): Criterion => ({ id, name, score, weight, assessor: "K. Somchai (Engineering Manager)", evidence });

export const DIMENSIONS: Dimension[] = [
  { key: "eng", name: "Engineering & Technical Competency", short: "Engineering", description: "Depth of structural analysis, design and code knowledge applied to real projects.", criteria: [c("ENG-01", "Structural analysis & modelling", 4.5, 3, "ETABS model review, Riverside Tower"), c("ENG-02", "Design code application", 4.0, 2, "Calculation package audit"), c("ENG-03", "Detailing & drawings", 4.0, 1, "Shop drawing checks")], strengths: "Highly reliable analytical models and clear calculation reports.", opportunities: "Broaden exposure to post-tensioned and steel connection design.", comments: "Consistently produces high-quality technical work.", actions: ["PT design workshop (Q1)", "Shadow senior reviewer on steel package"] },
  { key: "pdm", name: "Project & Delivery Management", short: "Delivery", description: "Planning, scheduling and delivering work packages on time and within scope.", criteria: [c("PDM-01", "Planning & scheduling", 3.5, 2, "Sprint plans, Bangna Warehouse"), c("PDM-02", "Scope & change control", 3.5, 2, "Change log"), c("PDM-03", "Budget tracking", null, 1, "Not applicable to current role")], strengths: "Dependable on deadlines for own packages.", opportunities: "Take ownership of a full package schedule.", comments: "Ready for more coordination responsibility.", actions: ["Lead deliverable schedule on next project"] },
  { key: "com", name: "Communication & Collaboration", short: "Communication", description: "Clarity with clients, consultants and teammates; constructive collaboration.", criteria: [c("COM-01", "Technical writing", 4.2, 2, "Design basis report"), c("COM-02", "Client & stakeholder meetings", 3.7, 2, "Coordination meeting notes"), c("COM-03", "Teamwork", 4.1, 1, "Peer feedback")], strengths: "Clear, well-structured written reports.", opportunities: "More confidence presenting to clients.", comments: "Valued teammate across disciplines.", actions: ["Present at next client design review"] },
  { key: "lead", name: "Leadership & Professional Growth", short: "Leadership", description: "Initiative, mentoring, ownership and continuous professional learning.", criteria: [c("LEAD-01", "Mentoring juniors", 3.0, 2, "Buddy for 1 intern"), c("LEAD-02", "Ownership & initiative", 3.4, 2, "Volunteered QA checklist"), c("LEAD-03", "Professional licence progress", 3.2, 1, "Preparing for Saman licence")], strengths: "Takes initiative on internal improvements.", opportunities: "Formal mentoring role and licence completion.", comments: "Steady growth trajectory.", actions: ["Complete licence exam", "Mentor one graduate engineer"] },
  { key: "dig", name: "Digital, Technology & Innovation", short: "Digital", description: "Use of BIM, automation and digital tools to improve how FORM works.", criteria: [c("DIG-01", "BIM & digital modelling", 4.6, 2, "Revit coordination model"), c("DIG-02", "Automation & scripting", 4.5, 2, "Python load-takedown tool"), c("DIG-03", "Innovation contribution", 4.3, 1, "Innovation Day submission")], strengths: "Built internal tools now used by the team.", opportunities: "Document and share tools firm-wide.", comments: "A digital champion for the department.", actions: ["Run internal scripting session"] },
  { key: "cul", name: "Professional Responsibility & Culture", short: "Culture", description: "Ethics, safety, accountability and living FORM's values.", criteria: [c("CUL-01", "Ethics & accountability", 4.8, 2, "Manager review"), c("CUL-02", "Safety awareness", 4.6, 1, "Site visit reports"), c("CUL-03", "FORM values", 4.7, 2, "Peer nominations")], strengths: "Exemplary accountability and team spirit.", opportunities: "Represent FORM culture in onboarding.", comments: "Role model for FORM values.", actions: ["Co-host onboarding culture session"] },
];

export type Assessment = { id: string; label: string; date: string; status: "Finalized" | "Under Review" | "Draft"; scores: Record<string, number> };
export const ASSESSMENTS: Assessment[] = [
  { id: "2026-h1", label: "Latest Assessment", date: "30 Jun 2026", status: "Finalized", scores: Object.fromEntries(DIMENSIONS.map((d) => [d.key, dimensionScore(d.criteria) ?? 0])) },
  { id: "2025-h2", label: "Previous Assessment", date: "15 Dec 2025", status: "Finalized", scores: { eng: 3.9, pdm: 3.1, com: 3.7, lead: 2.8, dig: 4.0, cul: 4.5 } },
  { id: "2025-h1", label: "Historical", date: "20 Jun 2025", status: "Finalized", scores: { eng: 3.5, pdm: 2.8, com: 3.4, lead: 2.5, dig: 3.6, cul: 4.2 } },
];

/* ---------- Employee (sample preview data) ---------- */
export const EMPLOYEE = {
  fullName: "Puttita Chansakran",
  nickname: "Ploy",
  id: "FORM-0427",
  department: "Engineering Department",
  position: "Structural Engineer II",
  startDate: new Date(2023, 6, 1),
  status: "Full-time · Active",
  email: "puttita.c@form.co.th",
};

export type Benefit = { id: string; category: string; name: string; description: string; status: "Active" | "Available" | "Pending Approval" | "Fully Used" | "Expired" | "Not Eligible"; value: string; total?: number; used?: number; unit?: string; validity: string; eligibility: string; claim: string; terms: string };
export const BENEFITS: Benefit[] = [
  { id: "starbucks", category: "Performance-Based Benefits", name: "FORM Plus · Starbucks Card", description: "Monthly coffee allowance for FORM Plus members.", status: "Active", value: "THB 500 / month", total: 500, used: 320, unit: "THB", validity: "1–30 Nov 2026", eligibility: "FORM Plus performance criteria met in latest review cycle.", claim: "Balance is loaded automatically to your Starbucks Card on the 1st of each month.", terms: "Unused balance does not roll over." },
  { id: "credit", category: "Performance-Based Benefits", name: "FORM Plus Credit", description: "Self-Care · Learning · Health · Gear · Explore.", status: "Active", value: "THB 25,000 / year", total: 25000, used: 11400, unit: "THB", validity: "Jan–Dec 2026", eligibility: "FORM Plus performance criteria met in latest review cycle.", claim: "Submit receipts through the Reimbursement module within 30 days.", terms: "Covers Self-Care, Learning, Health, Gear and Explore categories only." },
  { id: "learning", category: "Learning & Professional Development", name: "Professional Development", description: "Training, courses and licence exam support.", status: "Available", value: "Up to 3 courses / year", total: 3, used: 1, unit: "courses", validity: "Jan–Dec 2026", eligibility: "All full-time employees after probation.", claim: "Request approval from your manager before enrolling.", terms: "Bond terms apply to programs above THB 30,000." },
  { id: "health", category: "Health & Wellbeing", name: "Group Health Insurance", description: "IPD/OPD cover and annual health check.", status: "Active", value: "OPD THB 2,000 / visit", validity: "Policy year 2026", eligibility: "All full-time employees.", claim: "Show your insurance card at partner hospitals.", terms: "Per insurer policy schedule." },
];

export type Award = { id: string; name: string; category: string; date: string; description: string; reason: string; issuedBy: string; project?: string; evidence: string; icon: "trophy" | "spark" | "users" | "heart" | "medal"; visibility: "Private" | "Public Internal" };
export const AWARDS: Award[] = [
  { id: "a1", name: "Innovation Achievement", category: "Innovation & Technology", date: "12 Sep 2026", description: "Recognised for an automated load-takedown tool.", reason: "Reduced preliminary design time by ~40% across three projects.", issuedBy: "FORM Innovation Committee", project: "Riverside Tower", evidence: "Tool documentation & usage log", icon: "spark", visibility: "Public Internal" },
  { id: "a2", name: "FORM Culture Champion", category: "Culture & Values", date: "20 Mar 2026", description: "Peer-nominated for living FORM values.", reason: "Nominated by 7 colleagues for support and accountability.", issuedBy: "People & Culture", evidence: "Peer nominations", icon: "heart", visibility: "Public Internal" },
  { id: "a3", name: "Outstanding Team Collaboration", category: "Leadership & Collaboration", date: "05 Nov 2025", description: "Cross-discipline coordination excellence.", reason: "Led structural–MEP clash resolution under tight deadline.", issuedBy: "Engineering Director", project: "Bangna Warehouse", evidence: "Project close-out report", icon: "users", visibility: "Private" },
  { id: "a4", name: "Service Anniversary — 3 Years", category: "Career Milestones", date: "01 Jul 2026", description: "Three years with FORM.", reason: "Celebrating three years of contribution.", issuedBy: "FORM", evidence: "HR record", icon: "medal", visibility: "Public Internal" },
];

export const MILESTONES = [
  { date: "Jul 2023", title: "Joined FORM", detail: "Structural Engineer I · Elastic Class" },
  { date: "Jan 2024", title: "Probation completed", detail: "Confirmed full-time" },
  { date: "Nov 2024", title: "First lead package", detail: "Bangna Warehouse foundations" },
  { date: "Jul 2025", title: "Promoted", detail: "Structural Engineer II" },
  { date: "Jul 2025", title: "Yield Class achieved", detail: "2 years of service" },
  { date: "Sep 2026", title: "Innovation Achievement", detail: "Automated load-takedown tool" },
];
