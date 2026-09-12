import { Bot, BrainCircuit, FileSearch, GitCompareArrows, ShieldCheck } from "lucide-react";

import type { DetectionSource } from "@/types";

const sourceIcons = {
  "Rule Engine": ShieldCheck,
  "ML Anomaly Detection": BrainCircuit,
  "Static Analysis": FileSearch,
  "Semantic Analysis": GitCompareArrows,
  "Multiple Sources": Bot,
} satisfies Record<DetectionSource, typeof Bot>;

interface SourceBadgeProps {
  source: DetectionSource;
}

export function SourceBadge({ source }: SourceBadgeProps) {
  const Icon = sourceIcons[source];

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-app-border bg-app-elevated px-2.5 py-1 text-xs font-medium text-app-muted">
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {source}
    </span>
  );
}
