import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { categoryOptions, sourceOptions } from "@/lib/utils";
import type { FindingCategory, Severity, Vendor } from "@/types";
import type { FindingQuery } from "@/services/api";

const severities: Array<Severity | "all"> = ["all", "critical", "high", "medium", "low", "info"];
const vendors: Array<Vendor | "all"> = ["all", "Cisco IOS", "Juniper", "Fortinet", "SonicWall", "Other"];
const sortOptions: NonNullable<FindingQuery["sortBy"]>[] = [
  "severity",
  "confidence",
  "category",
  "location",
];

interface FindingFiltersProps {
  query: FindingQuery;
  onChange: (query: FindingQuery) => void;
  devices?: string[];
  resultCount?: number;
}

function updateQuery<T extends keyof FindingQuery>(
  query: FindingQuery,
  key: T,
  value: FindingQuery[T],
) {
  return { ...query, [key]: value };
}

export function FindingFilters({ query, onChange, devices = [], resultCount }: FindingFiltersProps) {
  return (
    <div className="rounded-lg border border-app-border bg-app-surface p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
          <Input
            aria-label="Search findings"
            placeholder="Search findings, devices, locations, impacts"
            value={query.search ?? ""}
            className="pl-9"
            onChange={(event) => onChange(updateQuery(query, "search", event.target.value))}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 xl:w-[760px]">
          <Select
            aria-label="Filter by severity"
            value={query.severity ?? "all"}
            onChange={(event) =>
              onChange(updateQuery(query, "severity", event.target.value as Severity | "all"))
            }
          >
            {severities.map((severity) => (
              <option key={severity} value={severity}>
                {severity === "all" ? "All severities" : severity}
              </option>
            ))}
          </Select>

          <Select
            aria-label="Filter by category"
            value={query.category ?? "all"}
            onChange={(event) =>
              onChange(updateQuery(query, "category", event.target.value as FindingCategory | "all"))
            }
          >
            <option value="all">All categories</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>

          <Select
            aria-label="Filter by vendor"
            value={query.vendor ?? "all"}
            onChange={(event) =>
              onChange(updateQuery(query, "vendor", event.target.value as Vendor | "all"))
            }
          >
            {vendors.map((vendor) => (
              <option key={vendor} value={vendor}>
                {vendor === "all" ? "All vendors" : vendor}
              </option>
            ))}
          </Select>

          <Select
            aria-label="Filter by device"
            value={query.device ?? "all"}
            onChange={(event) => onChange(updateQuery(query, "device", event.target.value))}
          >
            <option value="all">All devices</option>
            {devices.map((device) => (
              <option key={device} value={device}>
                {device}
              </option>
            ))}
          </Select>

          <Select
            aria-label="Sort findings"
            value={query.sortBy ?? "severity"}
            onChange={(event) =>
              onChange(updateQuery(query, "sortBy", event.target.value as FindingQuery["sortBy"]))
            }
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                Sort by {option}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Select
          aria-label="Filter by detection source"
          className="w-full sm:w-72"
          value={query.source ?? "all"}
          onChange={(event) => onChange(updateQuery(query, "source", event.target.value))}
        >
          <option value="all">All detection sources</option>
          {sourceOptions.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </Select>
        {typeof resultCount === "number" ? (
          <span className="rounded-full border border-app-border bg-app-elevated px-3 py-1.5 text-xs font-semibold text-app-muted">
            {resultCount} results
          </span>
        ) : null}
      </div>
    </div>
  );
}
