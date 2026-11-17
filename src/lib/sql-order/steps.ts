// written order
export const QUERY_LINES = [
    "SELECT customer sum(amount) as spent",
    "FROM orders",
    "WHERE order_date >= '2026-10-01'",
    "GROUP BY customer",
    "HAVING SUM(amount) > 50",
    "ORDER BY spent DESC",
    "LIMIT 3",
] as const;

// run order as stepId
export type StepId = 
    | "from" | "where" | "groupBy" | "having" | "select" | "orderBy" | "limit";

export type Step = {
    id: StepId;
    line: number; // QUERY_LINES to highligh
    operator: string; // relational alg symbol. "" if none
    operatorName: string;
    comment: string;
};

// order SQL RUNS them.
export const STEPS: Step[] = [
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
];