import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  GitCompareArrows,
  ShieldAlert,
  XCircle,
} from "lucide-react";

import type { Finding, ValidationStatus } from "@/types";
import { SeverityBadge } from "@/components/common/SeverityBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const statusProgression = [
  "Detected",
  "Explained",
  "Recommended",
  "Validated",
  "Awaiting Approval",
];

const validationIcon: Record<
  ValidationStatus,
  typeof CheckCircle2
> = {
  passed: CheckCircle2,
  warning: ShieldAlert,
  failed: XCircle,
  not_run: Circle,
};

function CodeBlock({
  title,
  lines,
}: {
  title: string;
  lines: string[];
}) {
  return (
    <div className="rounded-lg border border-app-border bg-[#080C11]">
      <div className="border-b border-app-border px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
          {title}
        </p>
      </div>

      <pre className="overflow-x-auto p-4 font-mono text-xs leading-6 text-slate-300">
        {lines.join("\n")}
      </pre>
    </div>
  );
}

function DiffBlock({ lines }: { lines: string[] }) {
  return (
    <div className="rounded-lg border border-app-border bg-[#080C11]">
      <div className="flex items-center gap-2 border-b border-app-border px-4 py-3">
        <GitCompareArrows
          className="h-4 w-4 text-app-muted"
          aria-hidden="true"
        />

        <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
          Configuration Diff
        </p>
      </div>

      <pre className="overflow-x-auto p-4 font-mono text-xs leading-6">
        {lines.map((line, index) => {
          const isAdded = line.startsWith("+");
          const isRemoved = line.startsWith("-");

          return (
            <div
              key={`${line}-${index}`}
              className={cn(
                "px-2",
                isAdded
                  ? "bg-app-success/10 text-green-100"
                  : "",
                isRemoved
                  ? "bg-app-critical/12 text-red-100"
                  : "",
                !isAdded && !isRemoved
                  ? "text-slate-400"
                  : "",
              )}
            >
              {line}
            </div>
          );
        })}
      </pre>
    </div>
  );
}

export function RemediationPanel({
  finding,
}: {
  finding: Finding;
}) {
  const [decision, setDecision] = useState<
    "approved" | "rejected" | null
  >(null);

  const handleReject = () => {
    setDecision("rejected");
  };

  const handleApprove = () => {
    setDecision("approved");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle>Review Recommended Fix</CardTitle>

            <p className="mt-1 text-sm text-app-muted">
              Proposed remediation is validated for review and still
              requires engineer approval.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge
              severity={finding.remediation.riskLevel}
            />

            <StatusBadge
              status={finding.validation.status}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Status Progression */}
        <div className="flex gap-2 overflow-x-auto rounded-lg border border-app-border bg-app-bg p-2">
          {statusProgression.map((step, index) => (
            <div
              key={step}
              className="flex min-w-max items-center gap-2"
            >
              <span className="rounded-full border border-app-primary/35 bg-app-primary/12 px-3 py-1 text-xs font-semibold text-blue-100">
                {step}
              </span>

              {index < statusProgression.length - 1 ? (
                <span
                  className="text-app-muted"
                  aria-hidden="true"
                >
                  /
                </span>
              ) : null}
            </div>
          ))}
        </div>

        {/* Remediation Summary */}
        <p className="rounded-lg border border-app-border bg-app-elevated p-4 text-sm leading-6 text-app-text">
          {finding.remediation.summary}
        </p>

        {/* Current / Proposed Configuration */}
        <div className="grid gap-4 xl:grid-cols-2">
          <CodeBlock
            title="Current Configuration"
            lines={finding.remediation.currentConfig}
          />

          <CodeBlock
            title="Proposed Configuration"
            lines={finding.remediation.proposedConfig}
          />
        </div>

        {/* Configuration Diff */}
        <DiffBlock
          lines={finding.remediation.diff}
        />

        {/* Validation Checks */}
        <div className="grid gap-3 lg:grid-cols-4">
          {finding.validation.checks.map((check) => {
            const Icon = validationIcon[check.status];

            return (
              <div
                key={check.name}
                className="rounded-lg border border-app-border bg-app-elevated p-4"
              >
                <div className="flex items-center gap-2">
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      check.status === "passed"
                        ? "text-app-success"
                        : "",
                      check.status === "warning"
                        ? "text-app-medium"
                        : "",
                      check.status === "failed"
                        ? "text-app-critical"
                        : "",
                      check.status === "not_run"
                        ? "text-app-muted"
                        : "",
                    )}
                    aria-hidden="true"
                  />

                  <p className="text-sm font-semibold text-app-text">
                    {check.name}
                  </p>
                </div>

                <p className="mt-2 text-sm leading-6 text-app-muted">
                  {check.detail}
                </p>
              </div>
            );
          })}
        </div>

        {/* Approval Section */}
        <div className="flex flex-col gap-3 rounded-lg border border-app-medium/35 bg-app-medium/10 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-yellow-100">
              Engineer Approval Required
            </p>

            <p className="mt-1 text-sm text-app-muted">
              The prototype does not deploy or apply configuration
              changes.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Reject Button */}
            <Button
              variant="outline"
              onClick={handleReject}
              disabled={decision !== null}
            >
              <XCircle
                className="h-4 w-4"
                aria-hidden="true"
              />

              Reject
            </Button>

            {/* Approve Button */}
            <Button
              onClick={handleApprove}
              disabled={decision !== null}
            >
              <CheckCircle2
                className="h-4 w-4"
                aria-hidden="true"
              />

              Review & Approve
            </Button>
          </div>
        </div>

        {/* Rejection Result */}
        {decision === "rejected" ? (
          <div className="rounded-lg border border-app-critical/35 bg-app-critical/10 p-4">
            <div className="flex items-start gap-3">
              <XCircle
                className="mt-0.5 h-5 w-5 shrink-0 text-app-critical"
                aria-hidden="true"
              />

              <div>
                <p className="text-sm font-semibold text-red-100">
                  Remediation Rejected
                </p>

                <p className="mt-1 text-sm leading-6 text-app-muted">
                  The recommended remediation was rejected by the
                  engineer. No configuration changes were applied.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Approval Result */}
        {decision === "approved" ? (
          <div className="rounded-lg border border-app-success/35 bg-app-success/10 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2
                className="mt-0.5 h-5 w-5 shrink-0 text-app-success"
                aria-hidden="true"
              />

              <div>
                <p className="text-sm font-semibold text-green-100">
                  Remediation Approved
                </p>

                <p className="mt-1 text-sm leading-6 text-app-muted">
                  The recommended remediation has been approved for
                  deployment review. No configuration changes were
                  applied by this prototype.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}