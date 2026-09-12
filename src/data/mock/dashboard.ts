import type { DashboardData } from "@/types";

import { mockFindings } from "./findings";
import { mockScans } from "./scans";

export const mockDashboardData: DashboardData = {
  healthScore: 82,
  healthStatus: "Good - Review Needed",
  summary: {
    critical: 2,
    high: 6,
    medium: 4,
    low: 2,
    info: 1,
    passed: 742,
  },
  metrics: [
    {
      label: "Configurations Scanned",
      value: 7,
      detail: "Last 7 days",
      tone: "neutral",
    },
    {
      label: "Critical Issues",
      value: 2,
      detail: "Deployment blockers",
      tone: "critical",
    },
    {
      label: "High Issues",
      value: 6,
      detail: "Require review",
      tone: "high",
    },
    {
      label: "Medium Issues",
      value: 4,
      detail: "Planned remediation",
      tone: "medium",
    },
    {
      label: "Passed Checks",
      value: 742,
      detail: "Rule and semantic checks",
      tone: "success",
    },
  ],
  issueCategories: [
    { name: "IP Addressing", value: 2 },
    { name: "Routing", value: 2 },
    { name: "VLAN", value: 1 },
    { name: "Security / ACL", value: 3 },
    { name: "Management", value: 3 },
    { name: "Other", value: 1 },
  ],
  severityDistribution: [
    { name: "Critical", value: 2 },
    { name: "High", value: 6 },
    { name: "Medium", value: 4 },
    { name: "Low", value: 2 },
    { name: "Info", value: 1 },
  ],
  healthTrend: [
    { date: "Sep 05", health: 95 },
    { date: "Sep 07", health: 91 },
    { date: "Sep 08", health: 68 },
    { date: "Sep 09", health: 79 },
    { date: "Sep 10", health: 81 },
    { date: "Sep 10", health: 72 },
  ],
  recentScans: mockScans.slice(0, 6),
  criticalFindings: mockFindings
    .filter((finding) => finding.severity === "critical")
    .concat(mockFindings.filter((finding) => finding.severity === "high").slice(0, 2)),
};
