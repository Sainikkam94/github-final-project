import { Download, FileText } from "lucide-react";

import type { DashboardData, Finding } from "@/types";
import { SeverityBadge } from "@/components/common/SeverityBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReportPreviewProps {
  dashboard: DashboardData;
  findings: Finding[];
}

export function ReportPreview({ dashboard, findings }: ReportPreviewProps) {
  const critical = findings.filter((finding) => finding.severity === "critical");
  const high = findings.filter((finding) => finding.severity === "high");
  const medium = findings.filter((finding) => finding.severity === "medium");
  const security = findings.filter(
    (finding) => finding.category === "Security / ACL",
  );
  const routing = findings.filter(
    (finding) => finding.category === "Routing",
  );

  const handleExportReport = () => {
    const reportLines = [
      "CONFIGSENTINEL",
      "Configuration Analysis Report",
      "========================================",
      "",
      "PRE-DEPLOYMENT REVIEW SUMMARY",
      "Generated from local mock analysis data.",
      "",
      "DEVICE INFORMATION",
      "7 mock configurations across router, switch, and firewall devices",
      "",
      "CONFIGURATION HEALTH",
      `${dashboard.healthScore} / 100`,
      dashboard.healthStatus,
      "",
      "VALIDATION SUMMARY",
      "Recommended fixes remain in review state and require engineer approval.",
      "",
      "SUMMARY",
      "----------------------------------------",
      `Critical: ${dashboard.summary.critical}`,
      `High: ${dashboard.summary.high}`,
      `Medium: ${dashboard.summary.medium}`,
      `Security: ${security.length}`,
      `Passed: ${dashboard.summary.passed}`,
      "",
      "CRITICAL FINDINGS",
      "----------------------------------------",
      ...formatFindingsForExport(critical),
      "",
      "HIGH FINDINGS",
      "----------------------------------------",
      ...formatFindingsForExport(high),
      "",
      "MEDIUM FINDINGS",
      "----------------------------------------",
      ...formatFindingsForExport(medium),
      "",
      "SECURITY FINDINGS",
      "----------------------------------------",
      ...formatFindingsForExport(security),
      "",
      "ROUTING FINDINGS",
      "----------------------------------------",
      ...formatFindingsForExport(routing),
      "",
      "RECOMMENDATIONS",
      "----------------------------------------",
      "1. Resolve critical addressing and routing issues before deployment approval.",
      "2. Review broad security policies with application and security owners.",
      "3. Validate proposed fixes through syntax, semantic, conflict, and risk checks.",
      "",
      "========================================",
      "ConfigSentinel - Configuration Assurance",
    ];

    const reportContent = reportLines.join("\n");

    const blob = new Blob([reportContent], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "ConfigSentinel-Analysis-Report.txt";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 flex-none place-items-center rounded-lg border border-app-border bg-app-elevated">
              <FileText
                className="h-5 w-5 text-app-muted"
                aria-hidden="true"
              />
            </div>

            <div>
              <CardTitle>Configuration Analysis Report</CardTitle>
              <p className="mt-1 text-sm text-app-muted">
                Structured preview for IEEE demonstration and engineering
                review.
              </p>
            </div>
          </div>

          <Button onClick={handleExportReport}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Export Report
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mx-auto max-w-5xl rounded-lg border border-app-border bg-[#0D131A] p-5 md:p-8">
          <header className="border-b border-app-border pb-6">
            <p className="text-xs font-bold uppercase tracking-normal text-app-primary">
              ConfigSentinel
            </p>

            <h2 className="mt-2 text-2xl font-bold text-app-text">
              Configuration Analysis Report
            </h2>

            <p className="mt-2 text-sm leading-6 text-app-muted">
              Pre-deployment review summary generated from local mock analysis
              data.
            </p>
          </header>

          <section className="grid gap-4 border-b border-app-border py-6 md:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
                Device information
              </p>

              <p className="mt-2 text-sm text-app-text">
                7 mock configurations across router, switch, and firewall
                devices
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
                Configuration health
              </p>

              <p className="mt-2 text-3xl font-bold text-app-success">
                {dashboard.healthScore} / 100
              </p>

              <p className="text-sm text-app-muted">
                {dashboard.healthStatus}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
                Validation summary
              </p>

              <p className="mt-2 text-sm text-app-text">
                Recommended fixes remain in review state and require engineer
                approval.
              </p>
            </div>
          </section>

          <section className="grid gap-3 border-b border-app-border py-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Critical", dashboard.summary.critical, "text-app-critical"],
              ["High", dashboard.summary.high, "text-app-high"],
              ["Medium", dashboard.summary.medium, "text-app-medium"],
              ["Security", security.length, "text-app-primary"],
              ["Passed", dashboard.summary.passed, "text-app-success"],
            ].map(([label, value, className]) => (
              <div
                key={label}
                className="rounded-lg border border-app-border bg-app-bg p-4"
              >
                <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
                  {label}
                </p>

                <p
                  className={`mt-2 text-2xl font-bold ${className}`}
                >
                  {value}
                </p>
              </div>
            ))}
          </section>

          <ReportSection title="Critical Findings" findings={critical} />
          <ReportSection title="High Findings" findings={high} />
          <ReportSection title="Medium Findings" findings={medium} />
          <ReportSection title="Security Findings" findings={security} />
          <ReportSection title="Routing Findings" findings={routing} />

          <section className="pt-6">
            <h3 className="text-sm font-bold uppercase tracking-normal text-slate-500">
              Recommendations
            </h3>

            <ul className="mt-3 space-y-2 text-sm leading-6 text-app-text">
              <li>
                Resolve critical addressing and routing issues before
                deployment approval.
              </li>

              <li>
                Review broad security policies with application and security
                owners.
              </li>

              <li>
                Validate proposed fixes through syntax, semantic, conflict,
                and risk checks.
              </li>
            </ul>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}

function formatFindingsForExport(findings: Finding[]): string[] {
  if (!findings.length) {
    return ["No matching findings in the current mock report."];
  }

  return findings.slice(0, 4).flatMap((finding, index) => [
    `${index + 1}. ${finding.title}`,
    `   Severity: ${finding.severity.toUpperCase()}`,
    `   Category: ${finding.category}`,
    `   Device: ${finding.device}`,
    `   Location: ${finding.location.section}`,
    `   Impact: ${finding.impact}`,
    "",
  ]);
}

function ReportSection({
  title,
  findings,
}: {
  title: string;
  findings: Finding[];
}) {
  return (
    <section className="border-b border-app-border py-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold uppercase tracking-normal text-slate-500">
          {title}
        </h3>

        <span className="text-sm text-app-muted">
          {findings.length}
        </span>
      </div>

      {findings.length ? (
        <div className="mt-3 space-y-2">
          {findings.slice(0, 4).map((finding) => (
            <div
              key={finding.id}
              className="rounded-lg border border-app-border bg-app-bg p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <SeverityBadge severity={finding.severity} />

                <p className="font-semibold text-app-text">
                  {finding.title}
                </p>
              </div>

              <p className="mt-2 text-sm leading-6 text-app-muted">
                {finding.device} / {finding.location.section} -{" "}
                {finding.impact}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-app-muted">
          No matching findings in the current mock report.
        </p>
      )}
    </section>
  );
}