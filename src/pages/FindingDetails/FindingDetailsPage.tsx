import { useParams } from "react-router-dom";
import {
  AlertCircle,
  MapPin,
  Server,
  ShieldCheck,
  Target,
} from "lucide-react";

import { AIExplanationPanel } from "@/components/ai/AIExplanationPanel";
import { ConfigViewer } from "@/components/configuration/ConfigViewer";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { PageHeader } from "@/components/common/PageHeader";
import { SeverityBadge } from "@/components/common/SeverityBadge";
import { SourceBadge } from "@/components/common/SourceBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { RemediationPanel } from "@/components/remediation/RemediationPanel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAsyncData } from "@/hooks/useAsyncData";
import { formatPercent } from "@/lib/utils";
import {
  getConfigurationForFinding,
  getFindingDetails,
} from "@/services/api";

export function FindingDetailsPage() {
  const { findingId = "" } = useParams();

  const {
    data: finding,
    isLoading,
    error,
  } = useAsyncData(
    () => getFindingDetails(findingId),
    [findingId],
  );

  const {
    data: configuration,
    isLoading: configLoading,
    error: configError,
  } = useAsyncData(
    () => getConfigurationForFinding(findingId),
    [findingId],
  );

  if (isLoading) {
    return <LoadingState label="Loading finding details" />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!finding) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Finding not found"
        description="The requested finding is not available in the local mock dataset."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={finding.category}
        title={finding.title}
        description={`${finding.device} / ${finding.location.section}`}
        actions={<SeverityBadge severity={finding.severity} />}
      />

      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader>
            <CardTitle>Finding Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-app-border bg-app-elevated p-3">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-normal text-slate-500">
                  <Server
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                  Device
                </p>

                <p className="mt-2 font-mono text-sm text-app-text">
                  {finding.device}
                </p>

                <p className="mt-1 text-sm text-app-muted">
                  {finding.vendor}
                </p>
              </div>

              <div className="rounded-lg border border-app-border bg-app-elevated p-3">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-normal text-slate-500">
                  <MapPin
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                  Exact Location
                </p>

                <p className="mt-2 font-mono text-sm text-app-text">
                  {finding.location.section}
                </p>

                <p className="mt-1 text-sm text-app-muted">
                  Lines {finding.location.lineStart}
                  {finding.location.lineEnd
                    ? `-${finding.location.lineEnd}`
                    : ""}
                </p>
              </div>

              <div className="rounded-lg border border-app-border bg-app-elevated p-3">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-normal text-slate-500">
                  <ShieldCheck
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                  Detection Source
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {finding.detectionSources.map((source) => (
                    <SourceBadge
                      key={source}
                      source={source}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-app-border bg-app-elevated p-3">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-normal text-slate-500">
                  <Target
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                  Confidence
                </p>

                <p className="mt-2 font-mono text-lg font-bold text-app-text">
                  {formatPercent(finding.confidence)}
                </p>

                <StatusBadge
                  status={finding.validation.status}
                  className="mt-2"
                />
              </div>
            </div>

            <section className="rounded-lg border border-app-border bg-app-bg p-4">
              <h2 className="text-[11px] font-bold uppercase tracking-normal text-slate-500">
                What is wrong?
              </h2>

              <p className="mt-2 text-sm leading-6 text-app-text">
                {finding.description}
              </p>
            </section>

            <section className="rounded-lg border border-app-border bg-app-bg p-4">
              <h2 className="text-[11px] font-bold uppercase tracking-normal text-slate-500">
                Why is this a problem?
              </h2>

              <p className="mt-2 text-sm leading-6 text-app-text">
                {finding.whyItMatters}
              </p>
            </section>

            <section className="rounded-lg border border-app-border bg-app-bg p-4">
              <h2 className="text-[11px] font-bold uppercase tracking-normal text-slate-500">
                Potential impact
              </h2>

              <p className="mt-2 text-sm leading-6 text-app-text">
                {finding.impact}
              </p>
            </section>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evidence</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="rounded-lg border border-app-border bg-app-elevated p-4 text-sm leading-6 text-app-text">
              {finding.evidence.summary}
            </p>

            <div className="space-y-2">
              {finding.evidence.references.map((reference) => (
                <div
                  key={`${reference.label}-${reference.value}`}
                  className="flex flex-col gap-1 rounded-lg border border-app-border bg-app-bg p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-app-text">
                      {reference.label}
                    </p>

                    <p className="mt-1 font-mono text-xs text-app-muted">
                      {reference.value}
                    </p>
                  </div>

                  {reference.line ? (
                    <span className="font-mono text-xs text-app-muted">
                      line {reference.line}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <AIExplanationPanel finding={finding} />

      {configError ? (
        <ErrorState message={configError} />
      ) : null}

      {configLoading ? (
        <LoadingState label="Loading related configuration" />
      ) : configuration ? (
        <ConfigViewer
          configuration={configuration}
          highlightedLocation={finding.location}
        />
      ) : null}

      <RemediationPanel finding={finding} />
    </div>
  );
}