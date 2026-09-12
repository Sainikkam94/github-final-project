import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ServerCrash } from "lucide-react";

import { AnalysisProgress } from "@/components/analysis/AnalysisProgress";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { PageHeader } from "@/components/common/PageHeader";
import { FindingFilters } from "@/components/findings/FindingFilters";
import { FindingList } from "@/components/findings/FindingList";
import { IssueSummaryGrid } from "@/components/findings/IssueSummaryGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAsyncData } from "@/hooks/useAsyncData";
import { scoreTone } from "@/lib/utils";
import { getFindings, getScanDetails, type FindingQuery } from "@/services/api";
import type { FindingCategory } from "@/types";

const categories: FindingCategory[] = [
  "IP Addressing",
  "Routing",
  "VLAN",
  "Security / ACL",
  "Management",
  "Other",
];

export function AnalysisPage() {
  const { scanId = "" } = useParams();
  const [query, setQuery] = useState<FindingQuery>({ severity: "all", sortBy: "severity" });

  const isProgressRoute = scanId === "scan-progress";
  const { data: scan, isLoading: scanLoading, error: scanError } = useAsyncData(
    () => (isProgressRoute ? Promise.resolve(undefined) : getScanDetails(scanId)),
    [scanId, isProgressRoute],
  );
  const { data: findings, isLoading: findingsLoading, error: findingsError } = useAsyncData(
    () => getFindings(query),
    [query.search, query.severity, query.category, query.vendor, query.device, query.source, query.sortBy],
  );

  const scanFindings = useMemo(() => {
    if (!scan || !findings) {
      return [];
    }

    return findings.filter((finding) => scan.findingIds.includes(finding.id));
  }, [findings, scan]);

  const grouped = useMemo(() => {
    return categories
      .map((category) => ({
        category,
        findings: scanFindings.filter((finding) => finding.category === category),
      }))
      .filter((group) => group.findings.length);
  }, [scanFindings]);

  const devices = useMemo(
    () => (scan ? Array.from(new Set(scanFindings.map((finding) => finding.device))).sort() : []),
    [scan, scanFindings],
  );

  if (isProgressRoute) {
    return <AnalysisProgress />;
  }

  if (scanLoading) {
    return <LoadingState label="Loading scan result" />;
  }

  if (scanError) {
    return <ErrorState message={scanError} />;
  }

  if (!scan) {
    return (
      <EmptyState
        icon={ServerCrash}
        title="Scan result not found"
        description="The requested scan is not present in the local mock scan history."
      />
    );
  }

  if (findingsError) {
    return <ErrorState message={findingsError} />;
  }

  const totalIssues =
    scan.issueSummary.critical +
    scan.issueSummary.high +
    scan.issueSummary.medium +
    scan.issueSummary.low +
    scan.issueSummary.info;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={scan.id}
        title="Analysis Results"
        description={`${scan.configurationName} on ${scan.device}. Mock results show deterministic findings, anomaly signals, explanations, recommendations, and validation status.`}
      />

      <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Configuration Health</CardTitle>
            <p className="text-sm text-app-muted">{scan.vendor} / {scan.deviceType}</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className={`text-5xl font-bold tracking-normal ${scoreTone(scan.health)}`}>
                {scan.health}
              </span>
              <span className="pb-2 text-lg font-semibold text-app-muted">/ 100</span>
            </div>
            <Progress value={scan.health} className="mt-5" />
            <p className="mt-4 text-sm text-app-muted">
              {totalIssues ? `${totalIssues} active findings require review.` : "No active findings in this scan."}
            </p>
          </CardContent>
        </Card>
        <IssueSummaryGrid summary={scan.issueSummary} />
      </div>

      <FindingFilters
        query={query}
        onChange={setQuery}
        devices={devices}
        resultCount={scanFindings.length}
      />

      {findingsLoading ? (
        <LoadingState label="Loading scan findings" />
      ) : grouped.length ? (
        <div className="space-y-5">
          {grouped.map((group) => (
            <section key={group.category} className="space-y-3">
              <div className="flex items-center justify-between border-b border-app-border pb-2">
                <h2 className="text-lg font-semibold text-app-text">{group.category}</h2>
                <span className="text-sm text-app-muted">{group.findings.length} findings</span>
              </div>
              <FindingList findings={group.findings} />
            </section>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ServerCrash}
          title="No findings in this result view"
          description="The scan has no matching findings for the current filters, or the selected mock scan completed with no issues."
        />
      )}
    </div>
  );
}
