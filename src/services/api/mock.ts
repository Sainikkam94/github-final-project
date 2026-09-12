import type {
  ConfigurationFile,
  DashboardData,
  Finding,
  FindingCategory,
  ScanRecord,
  Severity,
  TopologyData,
  Vendor,
} from "@/types";

import { getConfigurationById, mockConfigurations } from "@/data/mock/configurations";
import { getFindingById, mockFindings } from "@/data/mock/findings";
import { mockDashboardData } from "@/data/mock/dashboard";
import { getScanById, mockScans } from "@/data/mock/scans";
import { mockTopology } from "@/data/mock/topology";
import { severityOrder } from "@/lib/utils";

const latency = 180;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), latency);
  });
}

export interface FindingQuery {
  search?: string;
  severity?: Severity | "all";
  category?: FindingCategory | "all";
  vendor?: Vendor | "all";
  device?: string | "all";
  source?: string | "all";
  sortBy?: "severity" | "confidence" | "category" | "location";
}

export async function getDashboardData(): Promise<DashboardData> {
  return delay(mockDashboardData);
}

export async function getFindings(query: FindingQuery = {}): Promise<Finding[]> {
  const normalizedSearch = query.search?.trim().toLowerCase();

  const filtered = mockFindings.filter((finding) => {
    const matchesSearch =
      !normalizedSearch ||
      [
        finding.title,
        finding.device,
        finding.vendor,
        finding.location.section,
        finding.relevantValue,
        finding.impact,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesSeverity =
      !query.severity || query.severity === "all" || finding.severity === query.severity;
    const matchesCategory =
      !query.category || query.category === "all" || finding.category === query.category;
    const matchesVendor = !query.vendor || query.vendor === "all" || finding.vendor === query.vendor;
    const matchesDevice = !query.device || query.device === "all" || finding.device === query.device;
    const matchesSource =
      !query.source ||
      query.source === "all" ||
      finding.detectionSources.some((source) => source === query.source);

    return (
      matchesSearch &&
      matchesSeverity &&
      matchesCategory &&
      matchesVendor &&
      matchesDevice &&
      matchesSource
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (query.sortBy) {
      case "confidence":
        return (b.confidence ?? 0) - (a.confidence ?? 0);
      case "category":
        return a.category.localeCompare(b.category);
      case "location":
        return a.location.section.localeCompare(b.location.section);
      case "severity":
      default:
        return severityOrder[b.severity] - severityOrder[a.severity];
    }
  });

  return delay(sorted);
}

export async function getFindingDetails(id: string): Promise<Finding | undefined> {
  return delay(getFindingById(id));
}

export async function getScanHistory(): Promise<ScanRecord[]> {
  return delay(mockScans);
}

export async function getScanDetails(id: string): Promise<ScanRecord | undefined> {
  return delay(getScanById(id));
}

export async function getConfiguration(id: string): Promise<ConfigurationFile | undefined> {
  return delay(getConfigurationById(id));
}

export async function getConfigurationForFinding(
  findingId: string,
): Promise<ConfigurationFile | undefined> {
  const finding = getFindingById(findingId);

  if (!finding) {
    return delay(undefined);
  }

  return delay(getConfigurationById(finding.relatedConfigId));
}

export async function getTopology(): Promise<TopologyData> {
  return delay(mockTopology);
}

export async function getConfigurations(): Promise<ConfigurationFile[]> {
  return delay(mockConfigurations);
}
