import { useEffect, useMemo, useState } from "react";
import type { ThemedToken } from "shiki";
import SqlPane from "./SqlPane";
import TablePane from "./TablePane";
import Controls from "./Controls";
import { STEPS } from "../../lib/sql-order/steps";
import { runQuery, DEFAULT_PARAMS } from "../../lib/sql-order/engine";

const LAST = STEPS.length - 1;
const HAVING_INDEX = STEPS.findIndex((s) => s.id === "having");

type Props = {
  tokens: ThemedToken[][];       // the correct query
  brokenTokens: ThemedToken[][]; // the step-0 query with the bug
};

export default function QueryStepper({ tokens, brokenTokens }: Props) {
  const [index, setIndex] = useState(0);
  const [params, setParams] = useState(DEFAULT_PARAMS);

  const states = useMemo(() => runQuery(params), [params]);
  const step = STEPS[index];
  const isIntro = step.id === "intro";

  const back = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(LAST, i + 1));
  const setMinTotal = (minTotal: number) => setParams((p) => ({ ...p, minTotal }));

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") back();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <SqlPane
          tokens={isIntro ? brokenTokens : tokens}
          activeLine={step.line}
          comment={step.comment}
          error={isIntro}
          live={
            isIntro
              ? undefined
              : {
                  line: STEPS[HAVING_INDEX].line,
                  match: String(DEFAULT_PARAMS.minTotal),
                  value: String(params.minTotal),
                }
          }
        />
        <TablePane state={states[step.id]} />
      </div>
      <Controls
        index={index}
        onBack={back}
        onNext={next}
        onJump={setIndex}
        minTotal={params.minTotal}
        onMinTotalChange={setMinTotal}
        showSlider={index >= HAVING_INDEX}
      />
    </div>
  );
}