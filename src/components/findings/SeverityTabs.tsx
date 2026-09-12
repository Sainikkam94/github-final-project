import type { Severity } from "@/types";
import { cn, severityMeta } from "@/lib/utils";

const severities: Array<Severity | "all"> = ["all", "critical", "high", "medium", "low", "info"];

interface SeverityTabsProps {
  value: Severity | "all";
  onChange: (value: Severity | "all") => void;
  counts: Record<Severity, number>;
}

export function SeverityTabs({ value, onChange, counts }: SeverityTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto rounded-lg border border-app-border bg-app-surface p-2">
      {severities.map((severity) => {
        const active = value === severity;
        const label = severity === "all" ? "All" : severityMeta[severity].label;
        const count =
          severity === "all"
            ? Object.values(counts).reduce((total, current) => total + current, 0)
            : counts[severity];

        return (
          <button
            key={severity}
            className={cn(
              "h-9 whitespace-nowrap rounded-lg px-3 text-sm font-semibold transition-colors",
              active
                ? "bg-app-primary text-white"
                : "text-app-muted hover:bg-app-elevated hover:text-app-text",
            )}
            onClick={() => onChange(severity)}
            type="button"
          >
            {label} <span className={active ? "text-blue-100" : "text-slate-500"}>{count}</span>
          </button>
        );
      })}
    </div>
  );
}
