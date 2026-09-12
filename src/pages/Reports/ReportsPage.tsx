import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { PageHeader } from "@/components/common/PageHeader";
import { ReportPreview } from "@/components/reports/ReportPreview";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getDashboardData, getFindings } from "@/services/api";

export function ReportsPage() {
  const { data: dashboard, isLoading: dashboardLoading, error: dashboardError } = useAsyncData(
    () => getDashboardData(),
    [],
  );
  const { data: findings, isLoading: findingsLoading, error: findingsError } = useAsyncData(
    () => getFindings(),
    [],
  );

  if (dashboardLoading || findingsLoading) {
    return <LoadingState label="Preparing report preview" />;
  }

  if (dashboardError || findingsError) {
    return <ErrorState message={dashboardError ?? findingsError ?? "Report data is unavailable."} />;
  }

  if (!dashboard || !findings) {
    return <ErrorState message="Report data is unavailable." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reports"
        title="Analysis Report Preview"
        description="Generate a professional review package from mock configuration health, finding evidence, recommendations, and validation status."
      />
      <ReportPreview dashboard={dashboard} findings={findings} />
    </div>
  );
}
