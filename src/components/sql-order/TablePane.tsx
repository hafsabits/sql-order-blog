import { AnimatePresence, motion } from "motion/react";
import type { Order } from "../../lib/sql-order/orders";
import type { TableState } from "../../lib/sql-order/engine";

// Written out in full so Tailwind can find them (see notes).
const COLORS: Record<string, string> = {
  Ana: "border-sky-400 bg-sky-400/15",
  Ben: "border-amber-400 bg-amber-400/15",
  Cy:  "border-emerald-400 bg-emerald-400/15",
  Dee: "border-rose-400 bg-rose-400/15",
  Eli: "border-violet-400 bg-violet-400/15",
};
const NEUTRAL = "border-transparent bg-white/5";

type Item =
  | { kind: "order"; key: string; order: Order; grouped: boolean }
  | { kind: "group"; key: string; customer: string; total: number; collapsed: boolean };

// Flattens any table shape into one list of stable-keyed items.
function toItems(state: TableState): Item[] {
  switch (state.kind) {
    case "rows":
      return state.rows.map((o) => ({
        kind: "order", key: `order-${o.id}`, order: o, grouped: false,
      }));
    case "groups":
      return state.groups.flatMap((g) => [
        { kind: "group", key: `group-${g.customer}`, customer: g.customer, total: g.total, collapsed: false },
        ...g.rows.map((o) => ({
          kind: "order" as const, key: `order-${o.id}`, order: o, grouped: true,
        })),
      ]);
    case "result":
      return state.rows.map((r) => ({
        kind: "group", key: `group-${r.customer}`, customer: r.customer, total: r.spent, collapsed: true,
      }));
  }
}

export default function TablePane({ state }: { state: TableState }) {
  const items = toItems(state);
  const isResult = state.kind === "result";

  return (
    <div className="rounded-lg bg-[#0d1117] p-3 font-mono text-sm text-gray-200">
      {/* Column headers change at SELECT: that's π dropping columns */}
      <div className={`mb-2 grid px-3 text-xs uppercase text-gray-500 ${isResult ? "grid-cols-2" : "grid-cols-3"}`}>
        <span>customer</span>
        {isResult ? (
          <span className="text-right">spent</span>
        ) : (
          <>
            <span className="text-right">amount</span>
            <span className="text-right">order_date</span>
          </>
        )}
      </div>

      <div className="relative flex flex-col gap-1">
        <AnimatePresence initial={false} mode="popLayout">
            {items.length === 0 && (
                <div className="px-3 py-1 italic text-gray-500">-- 0 rows</div>
            )}
          {items.map((item) => (
            <motion.div
              key={item.key}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className={`rounded border-l-4 px-3 py-1 transition-colors duration-500 ${
                item.kind === "order"
                  ? `ml-0 grid grid-cols-3 ${item.grouped ? `ml-4 ${COLORS[item.order.customer]}` : NEUTRAL}`
                  : `flex justify-between font-semibold ${COLORS[item.customer]}`
              }`}
            >
              {item.kind === "order" ? (
                <>
                  <span>{item.order.customer}</span>
                  <span className="text-right tabular-nums">${item.order.amount}</span>
                  <span className="text-right text-gray-400">{item.order.orderDate}</span>
                </>
              ) : (
                <>
                  <span>{item.customer}</span>
                  <span className="tabular-nums">
                    {item.collapsed ? `$${item.total}` : `SUM = $${item.total}`}
                  </span>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}