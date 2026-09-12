import { BrainCircuit, ShieldCheck } from "lucide-react";

import type { Finding } from "@/types";
import { SourceBadge } from "@/components/common/SourceBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatPercent } from "@/lib/utils";

export function AIExplanationPanel({ finding }: { finding: Finding }) {
  return (
    <Card className="border-app-primary/35 bg-app-primary/5">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 flex-none place-items-center rounded-lg border border-app-primary/40 bg-app-primary/12">
            <BrainCircuit className="h-5 w-5 text-blue-100" aria-hidden="true" />
          </div>
          <div>
            <CardTitle>AI Explanation</CardTitle>
            <p className="mt-1 text-sm text-app-muted">
              Explanation and recommendation layer, separate from deterministic detection.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-app-border bg-app-bg p-4">
          <p className="text-[11px] font-bold uppercase tracking-normal text-slate-500">
            Why this was flagged
          </p>
          <p className="mt-2 text-sm leading-6 text-app-text">{finding.aiExplanation}</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-app-border bg-app-bg p-4">
            <p className="text-[11px] font-bold uppercase tracking-normal text-slate-500">
              Potential impact
            </p>
            <p className="mt-2 text-sm leading-6 text-app-text">{finding.impact}</p>
          </div>
          <div className="rounded-lg border border-app-border bg-app-bg p-4">
            <p className="text-[11px] font-bold uppercase tracking-normal text-slate-500">
              Recommended action
            </p>
            <p className="mt-2 text-sm leading-6 text-app-text">{finding.recommendation}</p>
          </div>
        </div>

        <div className="rounded-lg border border-app-border bg-app-bg p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-app-text">Confidence</p>
              <p className="text-xs text-app-muted">
                Confidence is shown for prototype explainability, not autonomous approval.
              </p>
            </div>
            <span className="font-mono text-lg font-bold text-blue-100">
              {formatPercent(finding.confidence)}
            </span>
          </div>
          <Progress value={(finding.confidence ?? 0) * 100} className="mt-4" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-app-success/40 bg-app-success/10 px-2.5 py-1 text-xs font-semibold text-green-100">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Detected by
          </span>
          {finding.detectionSources.map((source) => (
            <SourceBadge key={source} source={source} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
