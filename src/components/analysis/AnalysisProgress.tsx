import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle, LoaderCircle, ShieldAlert } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const stages = [
  "Configuration uploaded",
  "Parsing configuration",
  "Interface analysis",
  "VLAN analysis",
  "Routing analysis",
  "Security / ACL analysis",
  "ML anomaly detection",
  "Generating explanations",
  "Preparing recommendations",
];

export function AnalysisProgress() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStageIndex((current) => Math.min(current + 1, stages.length));
    }, 850);

    return () => window.clearInterval(timer);
  }, []);

  const progress = Math.round((stageIndex / stages.length) * 100);
  const complete = stageIndex >= stages.length;
  const currentStage = complete ? "Analysis completed" : stages[stageIndex];

  const statusMessage = useMemo(() => {
    if (complete) {
      return "Configuration analysis completed with mock data. Results are ready for engineer review.";
    }

    if (currentStage === "ML anomaly detection") {
      return "Comparing parsed configuration features against the mock baseline profile.";
    }

    if (currentStage === "Generating explanations") {
      return "Preparing explanation-layer context without treating AI as the source of truth.";
    }

    return "Running staged validation checks before deployment approval.";
  }, [complete, currentStage]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analysis"
        title="Configuration Analysis Pipeline"
        description="The prototype shows how uploaded configuration data moves through parser, validation, anomaly, explanation, and recommendation stages."
        actions={
          <Button asChild variant="secondary">
            <Link to="/scan/new">Back to New Scan</Link>
          </Button>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Current Stage</CardTitle>
            <p className="text-sm text-app-muted">Mock scan ID: scan-progress</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-lg border border-app-border bg-app-elevated p-5">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg border border-app-primary/35 bg-app-primary/12">
                  {complete ? (
                    <CheckCircle2 className="h-5 w-5 text-app-success" aria-hidden="true" />
                  ) : (
                    <LoaderCircle className="h-5 w-5 animate-spin text-app-primary" aria-hidden="true" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold text-app-text">{currentStage}</p>
                  <p className="mt-2 text-sm leading-6 text-app-muted">{statusMessage}</p>
                </div>
              </div>
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs text-app-muted">
                  <span>Overall progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            </div>

            <div className="rounded-lg border border-app-medium/35 bg-app-medium/10 p-4">
              <div className="flex gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 flex-none text-app-medium" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-yellow-100">Engineer approval remains required</p>
                  <p className="mt-1 text-sm leading-6 text-app-muted">
                    This frontend prototype does not deploy configurations or apply fixes.
                  </p>
                </div>
              </div>
            </div>

            <Button asChild disabled={!complete} className={!complete ? "pointer-events-none opacity-50" : ""}>
              <Link to="/analysis/scan-1048">View Results</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pipeline Stages</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {stages.map((stage, index) => {
                const done = index < stageIndex;
                const current = index === stageIndex && !complete;

                return (
                  <li
                    key={stage}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3",
                      done
                        ? "border-app-success/30 bg-app-success/10"
                        : current
                          ? "border-app-primary/40 bg-app-primary/10"
                          : "border-app-border bg-app-elevated",
                    )}
                  >
                    {done ? (
                      <CheckCircle2 className="h-5 w-5 text-app-success" aria-hidden="true" />
                    ) : current ? (
                      <LoaderCircle className="h-5 w-5 animate-spin text-app-primary" aria-hidden="true" />
                    ) : (
                      <Circle className="h-5 w-5 text-app-muted" aria-hidden="true" />
                    )}
                    <span className={cn("text-sm font-semibold", done || current ? "text-app-text" : "text-app-muted")}>
                      {stage}
                    </span>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
