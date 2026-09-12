import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { PageHeader } from "@/components/common/PageHeader";
import { NetworkTopology } from "@/components/topology/NetworkTopology";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getFindings, getTopology } from "@/services/api";

export function TopologyPage() {
  const { data: topology, isLoading: topologyLoading, error: topologyError } = useAsyncData(
    () => getTopology(),
    [],
  );
  const { data: findings, isLoading: findingsLoading, error: findingsError } = useAsyncData(
    () => getFindings(),
    [],
  );

  if (topologyLoading || findingsLoading) {
    return <LoadingState label="Loading network topology" />;
  }

  if (topologyError || findingsError) {
    return <ErrorState message={topologyError ?? findingsError ?? "Topology data is unavailable."} />;
  }

  if (!topology || !findings) {
    return <ErrorState message="Topology data is unavailable." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Topology"
        title="Network Topology"
        description="Inspect mock device relationships, affected paths, and associated findings across pre-deployment configuration data."
      />
      <NetworkTopology topology={topology} findings={findings} />
    </div>
  );
}
