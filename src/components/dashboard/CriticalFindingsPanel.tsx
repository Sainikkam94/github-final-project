import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import type { Finding } from "@/types";
import { SeverityBadge } from "@/components/common/SeverityBadge";
import { SourceBadge } from "@/components/common/SourceBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CriticalFindingsPanel({ findings }: { findings: Finding[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Critical Findings</CardTitle>
        <p className="text-sm text-app-muted">Highest-risk issues requiring engineer review</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {findings.map((finding) => (
          <article
            key={finding.id}
            className="rounded-lg border border-app-border bg-app-elevated p-4"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityBadge severity={finding.severity} />
                  <span className="font-mono text-xs text-app-muted">{finding.device}</span>
                </div>
                <h3 className="text-base font-semibold text-app-text">{finding.title}</h3>
                <p className="text-sm text-app-muted">
                  <span className="font-mono text-slate-300">{finding.location.section}</span> -{" "}
                  {finding.impact}
                </p>
                <div className="flex flex-wrap gap-2">
                  {finding.detectionSources.map((source) => (
                    <SourceBadge key={source} source={source} />
                  ))}
                </div>
              </div>
              <Button asChild variant="secondary" size="sm" className="md:flex-none">
                <Link to={`/findings/${finding.id}`}>
                  View Details
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
