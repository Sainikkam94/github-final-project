import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { PageHeader } from "@/components/common/PageHeader";
import { CriticalFindingsPanel } from "@/components/dashboard/CriticalFindingsPanel";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { HealthPanel } from "@/components/dashboard/HealthPanel";
import { RecentScansTable } from "@/components/dashboard/RecentScansTable";
import { SummaryMetricGrid } from "@/components/dashboard/SummaryMetricGrid";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getDashboardData } from "@/services/api";

export function DashboardPage() {
  const { data, isLoading, error } = useAsyncData(() => getDashboardData(), []);

  if (isLoading) {
    return <LoadingState label="Loading configuration overview" />;
  }

  if (error || !data) {
    return <ErrorState message={error ?? "Dashboard data is unavailable."} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuration Overview"
        description="Analyze network configuration before deployment, review evidence, and validate proposed changes before engineer approval."
      />

      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <HealthPanel score={data.healthScore} status={data.healthStatus} />
        <SummaryMetricGrid metrics={data.metrics} />
      </div>

      <DashboardCharts
        categories={data.issueCategories}
        severities={data.severityDistribution}
        trend={data.healthTrend}
      />

      <div className="grid gap-4 2xl:grid-cols-[1fr_0.9fr]">
        <RecentScansTable scans={data.recentScans} />
        <CriticalFindingsPanel findings={data.criticalFindings} />
      </div>
    </div>
  );
}
