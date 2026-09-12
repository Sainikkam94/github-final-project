import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";

import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAsyncData } from "@/hooks/useAsyncData";
import { readableDate, scoreTone } from "@/lib/utils";
import { getScanHistory } from "@/services/api";
import type { ScanStatus, Vendor } from "@/types";

type SortKey = "date" | "health" | "findings" | "vendor";

const vendors: Array<Vendor | "all"> = ["all", "Cisco IOS", "Juniper", "Fortinet", "SonicWall", "Other"];
const statuses: Array<ScanStatus | "all"> = ["all", "completed", "limited", "failed", "in_progress", "queued"];

export function HistoryPage() {
  const { data, isLoading, error } = useAsyncData(() => getScanHistory(), []);
  const [search, setSearch] = useState("");
  const [vendor, setVendor] = useState<Vendor | "all">("all");
  const [status, setStatus] = useState<ScanStatus | "all">("all");
  const [sortBy, setSortBy] = useState<SortKey>("date");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return [...(data ?? [])]
      .filter((scan) => {
        const matchesSearch =
          !normalized ||
          [scan.id, scan.configurationName, scan.device, scan.vendor]
            .join(" ")
            .toLowerCase()
            .includes(normalized);
        const matchesVendor = vendor === "all" || scan.vendor === vendor;
        const matchesStatus = status === "all" || scan.status === status;

        return matchesSearch && matchesVendor && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "health") return b.health - a.health;
        if (sortBy === "vendor") return a.vendor.localeCompare(b.vendor);
        if (sortBy === "findings") return b.findingIds.length - a.findingIds.length;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [data, search, sortBy, status, vendor]);

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  if (isLoading) {
    return <LoadingState label="Loading scan history" />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Management"
        title="Scan History"
        description="Review historical mock configuration analyses and open completed scans for result details."
      />

      <Card>
        <CardHeader>
          <CardTitle>Historical Scans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_180px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="pl-9"
                placeholder="Search scans"
                aria-label="Search scans"
              />
            </div>
            <Select
              value={vendor}
              onChange={(event) => {
                setVendor(event.target.value as Vendor | "all");
                setPage(1);
              }}
              aria-label="Filter scans by vendor"
            >
              {vendors.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "All vendors" : option}
                </option>
              ))}
            </Select>
            <Select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as ScanStatus | "all");
                setPage(1);
              }}
              aria-label="Filter scans by status"
            >
              {statuses.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "All statuses" : option.replace("_", " ")}
                </option>
              ))}
            </Select>
            <Select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortKey)}
              aria-label="Sort scans"
            >
              <option value="date">Sort by date</option>
              <option value="health">Sort by health</option>
              <option value="findings">Sort by findings</option>
              <option value="vendor">Sort by vendor</option>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] text-left text-sm">
              <thead className="border-b border-app-border text-xs uppercase tracking-normal text-slate-500">
                <tr>
                  <th className="py-3 pr-4 font-semibold">Scan ID</th>
                  <th className="py-3 pr-4 font-semibold">Configuration</th>
                  <th className="py-3 pr-4 font-semibold">Vendor</th>
                  <th className="py-3 pr-4 font-semibold">Device</th>
                  <th className="py-3 pr-4 font-semibold">Health</th>
                  <th className="py-3 pr-4 font-semibold">Findings</th>
                  <th className="py-3 pr-4 font-semibold">Date</th>
                  <th className="py-3 pr-4 font-semibold">Status</th>
                  <th className="py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border">
                {pageRows.map((scan) => (
                  <tr key={scan.id}>
                    <td className="py-3 pr-4 font-mono text-xs text-app-muted">{scan.id}</td>
                    <td className="py-3 pr-4 font-mono text-xs text-app-text">{scan.configurationName}</td>
                    <td className="py-3 pr-4 text-app-muted">{scan.vendor}</td>
                    <td className="py-3 pr-4 font-semibold text-app-text">{scan.device}</td>
                    <td className={`py-3 pr-4 font-bold ${scoreTone(scan.health)}`}>{scan.health}</td>
                    <td className="py-3 pr-4 text-app-muted">{scan.findingIds.length}</td>
                    <td className="py-3 pr-4 text-app-muted">{readableDate(scan.date)}</td>
                    <td className="py-3 pr-4 text-app-muted">{scan.status.replace("_", " ")}</td>
                    <td className="py-3">
                      <Button asChild size="sm" variant="secondary">
                        <Link to={`/analysis/${scan.id}`}>
                          Open
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-app-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-app-muted">
              Showing {pageRows.length} of {filtered.length} scans
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
