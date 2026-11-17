import { STEPS, type StepId } from "../../lib/sql-order/steps";

const LAST_INDEX = STEPS.length - 1;

const LABELS: Record<StepId, string> = {
    intro: "THE BUG",
    from: "FROM", where: "WHERE", groupBy: "GROUP BY", having: "HAVING",
    select: "SELECT", orderBy: "ORDER BY", limit: "LIMIT",
    practice: "IN PRACTICE",
};

type Props = {
    index: number;
    onBack: () => void;
    onNext: () => void;
    onJump: (i: number) => void;
    minTotal: number;
    onMinTotalChange: (value: number) => void;
    showSlider: boolean;
};

export default function Controls({
    index, onBack, onNext, onJump, minTotal, onMinTotalChange, showSlider,
}: Props) {
    const step = STEPS[index];

    return (
        <div className="flex flex-col items-center gap-4 font-mono text-sm">
            <ol className="flex flex-wrap justify-center gap-1">
                {STEPS.map((s, i) => (
                <li key={s.id}>
                    <button
                        onClick={() => onJump(i)}
                        className={`rounded px-2 py-1 transition-colors ${
                            i === index
                            ? "bg-yellow-400 text-black"
                            : i < index
                            ? "bg-white/15 text-gray-200"
                            : "bg-white/5 text-gray-500"
                        }`}
                        >
                        {i}. {LABELS[s.id]}
                    </button>
                </li>
                ))}
            </ol>

            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    disabled={index === 0}
                    className="rounded border border-white/20 px-3 py-1 disabled:opacity-30"
                    >
                    ← Back
                </button>
                <span className="min-w-40 text-center text-gray-400">
                    {step.operator && <span className="mr-2 text-lg text-yellow-400">{step.operator}</span>}
                    {step.operatorName}
                </span>
                <button
                    onClick={onNext}
                    disabled={index === LAST_INDEX}
                    className="rounded border border-white/20 px-3 py-1 disabled:opacity-30"
                    >
                    Next →
                </button>
            </div>

            {/* The HAVING threshold. "invisible" keeps its space so nothing jumps. */}
            <label className={`flex items-center gap-3 text-gray-400 ${showSlider ? "" : "invisible"}`}>
                <span>HAVING SUM(amount) &gt;</span>
                <input
                    type="range"
                    min={0}
                    max={120}
                    step={5}
                    value={minTotal}
                    onChange={(e) => onMinTotalChange(Number(e.target.value))}
                    className="w-48 accent-yellow-400"
                />
                <span className="w-10 tabular-nums text-yellow-400">{minTotal}</span>
            </label>
        </div>
    );
}