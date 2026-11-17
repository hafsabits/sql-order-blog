import type { ThemedToken } from "shiki";

type Props = {
  tokens: ThemedToken[][]; // from Shiki: one array of colored tokens per line
  activeLine: number;
  comment: string;
  live?: { line: number; match: string; value: string }; // a token to swap live
  error?: boolean; // show the active line as an error (step 0)
};

export default function SqlPane({ tokens, activeLine, comment, live, error }: Props) {
  return (
    <div className="overflow-hidden rounded-lg bg-[#0d1117] font-mono text-sm">
      {/* Editor tab bar */}
      <div className="border-b border-white/10 px-4 py-2 text-xs text-gray-400">
        top_customers.sql
      </div>

      <pre className="py-3">
        {tokens.map((line, i) => {
          const active = i === activeLine;
          return (
            <div key={i}>
              {/* The explanation appears as a comment above the active line */}
              {active && (
                <div className={`pl-14 pr-4 italic ${error ? "text-red-400" : "text-emerald-400"}`}>
                  {comment}
                </div>
              )}

              <div
                className={`flex ${
                  active ? (error ? "bg-red-500/15" : "bg-yellow-400/10") : "opacity-40"
                }`}
              >
                {/* Gutter: debugger arrow (or error mark) + line number */}
                <span className={`w-6 shrink-0 text-center ${error ? "text-red-400" : "text-yellow-400"}`}>
                  {active ? (error ? "✖" : "▶") : ""}
                </span>
                <span className="w-6 shrink-0 select-none pr-2 text-right text-gray-600">
                  {i + 1}
                </span>

                {/* The code itself, colored by Shiki */}
                <span className="pl-2">
                  {line.map((token, j) => {
                    // If this is the live token (the HAVING number), swap in the slider's value
                    let text = token.content;
                    let isLive = false;
                    if (live && i === live.line && token.content.trim() === live.match) {
                      text = token.content.replace(live.match, live.value);
                      isLive = true;
                    }
                    return (
                      <span
                        key={j}
                        style={{ color: token.color }}
                        className={
                          isLive
                            ? "rounded bg-yellow-400/20 outline outline-1 outline-yellow-400/60"
                            : undefined
                        }
                      >
                        {text}
                      </span>
                    );
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </pre>
    </div>
  );
}