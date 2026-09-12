import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, CircleAlert } from "lucide-react";

import type { ScanRecord } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { readableDate, scoreTone } from "@/lib/utils";

export function RecentScansTable({ scans }: { scans: ScanRecord[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Scans</CardTitle>
        <p className="text-sm text-app-muted">Latest configuration analyses using mock service data</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-app-border text-xs uppercase tracking-normal text-slate-500">
              <tr>
                <th className="py-3 pr-4 font-semibold">Configuration</th>
                <th className="py-3 pr-4 font-semibold">Device</th>
                <th className="py-3 pr-4 font-semibold">Vendor</th>
                <th className="py-3 pr-4 font-semibold">Health</th>
                <th className="py-3 pr-4 font-semibold">Issues</th>
                <th className="py-3 pr-4 font-semibold">Date</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border">
              {scans.map((scan) => {
                const issues =
                  scan.issueSummary.critical +
                  scan.issueSummary.high +
                  scan.issueSummary.medium +
                  scan.issueSummary.low +
                  scan.issueSummary.info;

                return (
                  <tr key={scan.id} className="align-middle">
                    <td className="py-3 pr-4 font-mono text-xs text-app-text">{scan.configurationName}</td>
                    <td className="py-3 pr-4 font-semibold text-app-text">{scan.device}</td>
                    <td className="py-3 pr-4 text-app-muted">{scan.vendor}</td>
                    <td className={`py-3 pr-4 font-bold ${scoreTone(scan.health)}`}>{scan.health}</td>
                    <td className="py-3 pr-4 text-app-muted">{issues}</td>
                    <td className="py-3 pr-4 text-app-muted">{readableDate(scan.date)}</td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-app-border bg-app-elevated px-2.5 py-1 text-xs font-semibold text-app-muted">
                        {scan.status === "completed" ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-app-success" aria-hidden="true" />
                        ) : (
                          <CircleAlert className="h-3.5 w-3.5 text-app-medium" aria-hidden="true" />
                        )}
                        {scan.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3">
                      <Button asChild size="sm" variant="secondary">
                        <Link to={`/analysis/${scan.id}`}>
                          Open
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
