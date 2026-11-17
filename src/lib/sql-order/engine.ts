import { orders, type Order } from "./orders";
import type { StepId } from "./steps"

// values reader can manipulate
export type QueryParams = {
    since: string; // WHERE orderDate >= since
    minTotal: number; // HAVING SUM(amount) > minTotal
    limit: number; // LIMIT n
};

export const DEFAULT_PARAMS: QueryParams = {
    since: "2026-10-01",
    minTotal: 50,
    limit: 3,
};

export type Group = { customer: string; rows: Order[]; total: number };
export type ResultRow = { customer: string; spent: number };

export type TableState = 
    | { kind: "rows"; rows: Order[] }  // individual orders
    | { kind: "groups"; groups: Group[] }
    | { kind: "result"; rows: ResultRow[] };

function groupByCustomer(rows: Order[]): Group[] {
    const buckets = new Map<string, Order[]>();
    for (const row of rows) {
        const bucket = buckets.get(row.customer) ?? [];
        bucket.push(row);
        buckets.set(row.customer, bucket);
    }
    return [...buckets].map(([customer, rows]) => ({
        customer,
        rows,
        total: rows.reduce((sum, r) => sum + r.amount, 0),
    }));
}
// Runs the query in SQL's logical order and records the table after each step.
export function runQuery(p: QueryParams): Record<StepId, TableState> {
    const fromRows  = orders;
    const whereRows = fromRows.filter((r) => r.orderDate >= p.since);
    const groups    = groupByCustomer(whereRows);
    const kept      = groups.filter((g) => g.total > p.minTotal);
    const selected  = kept.map((g) => ({ customer: g.customer, spent: g.total }));
    const sorted    = [...selected].sort((a, b) => b.spent - a.spent);
    const limited   = sorted.slice(0, p.limit);

    return {
        from:    { kind: "rows",   rows: fromRows },
        where:   { kind: "rows",   rows: whereRows },
        groupBy: { kind: "groups", groups },
        having:  { kind: "groups", groups: kept },
        select:  { kind: "result", rows: selected },
        orderBy: { kind: "result", rows: sorted },
        limit:   { kind: "result", rows: limited },
    };
}