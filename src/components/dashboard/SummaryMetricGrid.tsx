import { AlertOctagon, AlertTriangle, CheckCircle2, CircleDot, Files, SignalHigh } from "lucide-react";

import type { DashboardMetric } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const toneClasses: Record<NonNullable<DashboardMetric["tone"]>, string> = {
  critical: "text-app-critical",
  high: "text-app-high",
  medium: "text-app-medium",
  low: "text-app-low",
  info: "text-app-muted",
  success: "text-app-success",
  neutral: "text-app-text",
};

const icons = [Files, AlertOctagon, SignalHigh, AlertTriangle, CheckCircle2, CircleDot];

export function SummaryMetricGrid({ metrics }: { metrics: DashboardMetric[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {metrics.map((metric, index) => {
        const Icon = icons[index] ?? CircleDot;
        const tone = metric.tone ?? "neutral";

        return (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-app-muted">{metric.label}</p>
                  <p className={cn("mt-2 text-2xl font-bold tracking-normal", toneClasses[tone])}>
                    {metric.value}
                  </p>
                </div>
                <div className="grid h-9 w-9 place-items-center rounded-lg border border-app-border bg-app-elevated">
                  <Icon className={cn("h-4 w-4", toneClasses[tone])} aria-hidden="true" />
                </div>
              </div>
              <p className="mt-3 text-xs text-app-muted">{metric.detail}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
