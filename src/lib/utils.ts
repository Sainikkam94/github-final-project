import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { DetectionSource, FindingCategory, Severity, ValidationStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const severityOrder: Record<Severity, number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  info: 1,
};

export const severityMeta: Record<
  Severity,
  { label: string; className: string; dotClassName: string; chartColor: string }
> = {
  critical: {
    label: "Critical",
    className: "border-app-critical/45 bg-app-critical/12 text-red-200",
    dotClassName: "bg-app-critical",
    chartColor: "#EF4444",
  },
  high: {
    label: "High",
    className: "border-app-high/45 bg-app-high/12 text-orange-200",
    dotClassName: "bg-app-high",
    chartColor: "#F97316",
  },
  medium: {
    label: "Medium",
    className: "border-app-medium/45 bg-app-medium/12 text-yellow-100",
    dotClassName: "bg-app-medium",
    chartColor: "#EAB308",
  },
  low: {
    label: "Low",
    className: "border-app-low/45 bg-app-low/12 text-blue-100",
    dotClassName: "bg-app-low",
    chartColor: "#3B82F6",
  },
  info: {
    label: "Info",
    className: "border-slate-400/40 bg-slate-400/10 text-slate-200",
    dotClassName: "bg-slate-300",
    chartColor: "#94A3B8",
  },
};

export const validationMeta: Record<
  ValidationStatus,
  { label: string; className: string; dotClassName: string }
> = {
  passed: {
    label: "Passed",
    className: "border-app-success/40 bg-app-success/12 text-green-100",
    dotClassName: "bg-app-success",
  },
  warning: {
    label: "Warning",
    className: "border-app-medium/45 bg-app-medium/12 text-yellow-100",
    dotClassName: "bg-app-medium",
  },
  failed: {
    label: "Failed",
    className: "border-app-critical/45 bg-app-critical/12 text-red-100",
    dotClassName: "bg-app-critical",
  },
  not_run: {
    label: "Not Run",
    className: "border-app-border bg-app-elevated text-app-muted",
    dotClassName: "bg-app-muted",
  },
};

export const categoryOptions: FindingCategory[] = [
  "IP Addressing",
  "Routing",
  "VLAN",
  "Security / ACL",
  "Management",
  "Other",
];

export const sourceOptions: DetectionSource[] = [
  "Rule Engine",
  "ML Anomaly Detection",
  "Static Analysis",
  "Semantic Analysis",
  "Multiple Sources",
];

export function formatPercent(value?: number) {
  if (typeof value !== "number") {
    return "N/A";
  }

  return `${Math.round(value * 100)}%`;
}

export function formatBytes(bytes?: number) {
  if (!bytes) {
    return "No file selected";
  }

  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function scoreTone(score: number) {
  if (score >= 85) return "text-app-success";
  if (score >= 70) return "text-app-medium";
  if (score >= 50) return "text-app-high";
  return "text-app-critical";
}

export function readableDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
