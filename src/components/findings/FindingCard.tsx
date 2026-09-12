import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Target } from "lucide-react";

import type { Finding } from "@/types";
import { SeverityBadge } from "@/components/common/SeverityBadge";
import { SourceBadge } from "@/components/common/SourceBadge";
import { Button } from "@/components/ui/button";
import { formatPercent } from "@/lib/utils";

export function FindingCard({ finding }: { finding: Finding }) {
  return (
    <article className="rounded-lg border border-app-border bg-app-surface p-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge severity={finding.severity} />
            <span className="rounded-full border border-app-border bg-app-elevated px-2.5 py-1 text-xs font-semibold text-app-muted">
              {finding.category}
            </span>
            <span className="font-mono text-xs text-app-muted">{finding.vendor}</span>
          </div>

          <h2 className="mt-3 text-lg font-semibold text-app-text">{finding.title}</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border border-app-border bg-app-elevated p-3">
              <p className="text-[11px] font-bold uppercase tracking-normal text-slate-500">What</p>
              <p className="mt-1 text-sm text-app-text">{finding.description}</p>
            </div>
            <div className="rounded-lg border border-app-border bg-app-elevated p-3">
              <p className="text-[11px] font-bold uppercase tracking-normal text-slate-500">Where</p>
              <p className="mt-1 font-mono text-xs text-app-text">
                {finding.device} / {finding.location.section}
              </p>
            </div>
            <div className="rounded-lg border border-app-border bg-app-elevated p-3">
              <p className="text-[11px] font-bold uppercase tracking-normal text-slate-500">Why</p>
              <p className="mt-1 text-sm text-app-text">{finding.whyItMatters}</p>
            </div>
            <div className="rounded-lg border border-app-border bg-app-elevated p-3">
              <p className="text-[11px] font-bold uppercase tracking-normal text-slate-500">Impact</p>
              <p className="mt-1 text-sm text-app-text">{finding.impact}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-app-border bg-app-elevated px-2.5 py-1 text-xs text-app-muted">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              Lines {finding.location.lineStart}
              {finding.location.lineEnd ? `-${finding.location.lineEnd}` : ""}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-app-border bg-app-elevated px-2.5 py-1 text-xs text-app-muted">
              <Target className="h-3.5 w-3.5" aria-hidden="true" />
              Confidence {formatPercent(finding.confidence)}
            </span>
            {finding.detectionSources.map((source) => (
              <SourceBadge key={source} source={source} />
            ))}
          </div>
        </div>

        <Button asChild variant="secondary" className="xl:flex-none">
          <Link to={`/findings/${finding.id}`}>
            View Details
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
