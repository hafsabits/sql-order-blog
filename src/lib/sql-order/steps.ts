// The query as it's WRITTEN, one clause per line.
export const QUERY_LINES = [
    "SELECT customer, SUM(amount) AS spent",
    "FROM orders",
    "WHERE order_date >= '2026-10-01'",
    "GROUP BY customer",
    "HAVING SUM(amount) > 50",
    "ORDER BY spent DESC",
    "LIMIT 3;",
] as const;

// The broken first attempt readers see on step 0: filtering on the alias in WHERE.
export const BROKEN_QUERY_LINES = [
    "SELECT customer, SUM(amount) AS spent",
    "FROM orders",
    "WHERE order_date >= '2026-10-01' AND spent > 50",
    "GROUP BY customer",
    "ORDER BY spent DESC",
    "LIMIT 3;",
] as const;

export type StepId =
  | "intro" | "from" | "where" | "groupBy" | "having" | "select" | "orderBy" | "limit" | "practice";

export type Step = {
    id: StepId;
    line: number;         // which line to highlight
    operator: string;     // relational algebra symbol ("" if none)
    operatorName: string;
    comment: string;      // the one-line "-- explanation"
};

// Step 0 is the bug; steps 1–7 are the order SQL RUNS the clauses.
export const STEPS: Step[] = [
    { id: "intro",   line: 2, operator: "",  operatorName: "why? press →",
        comment: '-- ERROR: column "spent" does not exist' },
    { id: "from",    line: 1, operator: "",  operatorName: "read the relation",
        comment: "-- Start with every row in orders" },
    { id: "where",   line: 2, operator: "σ", operatorName: "selection",
        comment: "-- Drop rows before Oct 1. `spent` doesn't exist yet!" },
    { id: "groupBy", line: 3, operator: "γ", operatorName: "grouping",
        comment: "-- One bucket per customer, SUM each bucket" },
    { id: "having",  line: 4, operator: "σ", operatorName: "selection on groups",
        comment: "-- Filter groups, not rows. Drag the slider ↓" },
    { id: "select",  line: 0, operator: "π", operatorName: "projection",
        comment: "-- Keep 2 columns. The alias `spent` is born here" },
    { id: "orderBy", line: 5, operator: "τ", operatorName: "sort",
        comment: "-- Now `spent` exists, so ORDER BY can use it" },
    { id: "limit",   line: 6, operator: "",  operatorName: "no RA operator",
        comment: "-- Keep the top 3. Sets have no 'first'" },
    { id: "practice", line: 1, operator: "", operatorName: "logical order ≠ physical plan",
    comment: "-- Real engines may use an index: Sept rows are never read" },
];