import { useMemo, useState } from "react";

import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { PageHeader } from "@/components/common/PageHeader";
import { FindingFilters } from "@/components/findings/FindingFilters";
import { FindingList } from "@/components/findings/FindingList";
import { SeverityTabs } from "@/components/findings/SeverityTabs";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getFindings, type FindingQuery } from "@/services/api";
import type { Severity } from "@/types";

const emptyCounts: Record<Severity, number> = {
  critical: 0,
  high: 0,
  medium: 0,
  low: 0,
  info: 0,
};

export function FindingsPage() {
  const [query, setQuery] = useState<FindingQuery>({ severity: "all", sortBy: "severity" });
  const { data, isLoading, error } = useAsyncData(
    () => getFindings(query),
    [query.search, query.severity, query.category, query.vendor, query.device, query.source, query.sortBy],
  );
  const { data: allFindings } = useAsyncData(() => getFindings({ severity: "all" }), []);

  const counts = useMemo(() => {
    return (
      allFindings?.reduce<Record<Severity, number>>(
        (accumulator, finding) => {
          accumulator[finding.severity] += 1;
          return accumulator;
        },
        { ...emptyCounts },
      ) ?? emptyCounts
    );
  }, [allFindings]);

  const devices = useMemo(
    () => Array.from(new Set((allFindings ?? []).map((finding) => finding.device))).sort(),
    [allFindings],
  );

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Findings"
        title="Configuration Findings"
        description="Review deterministic rules, semantic analysis, ML anomaly signals, and explanation-layer recommendations across mock scans."
      />

      <SeverityTabs
        value={query.severity ?? "all"}
        counts={counts}
        onChange={(severity) => setQuery((value) => ({ ...value, severity }))}
      />

      <FindingFilters
        query={query}
        onChange={setQuery}
        devices={devices}
        resultCount={data?.length}
      />

      {isLoading ? <LoadingState label="Loading findings" /> : <FindingList findings={data ?? []} />}
    </div>
  );
}
