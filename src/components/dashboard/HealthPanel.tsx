import { ShieldCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { scoreTone } from "@/lib/utils";

interface HealthPanelProps {
  score: number;
  status: string;
}

export function HealthPanel({ score, status }: HealthPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Overall Configuration Health</CardTitle>
            <p className="mt-1 text-sm text-app-muted">Weighted pre-deployment assurance score</p>
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-lg border border-app-primary/35 bg-app-primary/12">
            <ShieldCheck className="h-5 w-5 text-blue-100" aria-hidden="true" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-3">
          <span className={`text-5xl font-bold tracking-normal ${scoreTone(score)}`}>{score}</span>
          <span className="pb-2 text-lg font-semibold text-app-muted">/ 100</span>
        </div>
        <p className="mt-3 text-base font-semibold text-app-text">{status}</p>
        <Progress value={score} className="mt-5" />
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-app-border bg-app-elevated p-3">
            <p className="text-app-muted">Detected</p>
            <p className="mt-1 font-semibold text-app-text">Structured checks complete</p>
          </div>
          <div className="rounded-lg border border-app-border bg-app-elevated p-3">
            <p className="text-app-muted">Approval</p>
            <p className="mt-1 font-semibold text-app-text">Required before deployment</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
