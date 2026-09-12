export type Severity = "critical" | "high" | "medium" | "low" | "info";

export type FindingCategory =
  | "IP Addressing"
  | "Routing"
  | "VLAN"
  | "Security / ACL"
  | "Management"
  | "Other";

export type DetectionSource =
  | "Rule Engine"
  | "ML Anomaly Detection"
  | "Static Analysis"
  | "Semantic Analysis"
  | "Multiple Sources";

export type Vendor = "Cisco IOS" | "Juniper" | "Fortinet" | "SonicWall" | "Other";

export type DeviceType = "Router" | "Switch" | "Firewall";

export type ScanStatus = "completed" | "in_progress" | "failed" | "limited" | "queued";

export type ValidationStatus = "passed" | "warning" | "failed" | "not_run";

export interface IssueSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
  passed: number;
}

export interface LocationRef {
  section: string;
  lineStart: number;
  lineEnd?: number;
  interfaceName?: string;
  ruleName?: string;
}

export interface EvidenceReference {
  label: string;
  value: string;
  line?: number;
}

export interface FindingEvidence {
  summary: string;
  references: EvidenceReference[];
}

export interface ValidationCheck {
  name: string;
  status: ValidationStatus;
  detail: string;
}

export interface RemediationPlan {
  summary: string;
  currentConfig: string[];
  proposedConfig: string[];
  diff: string[];
  riskLevel: Severity;
  approvalRequired: boolean;
}

export interface FindingValidation {
  status: ValidationStatus;
  checks: ValidationCheck[];
}

export interface Finding {
  id: string;
  title: string;
  severity: Severity;
  category: FindingCategory;
  deviceId: string;
  device: string;
  vendor: Vendor;
  location: LocationRef;
  relevantValue: string;
  evidence: FindingEvidence;
  description: string;
  whyItMatters: string;
  impact: string;
  aiExplanation: string;
  recommendation: string;
  confidence?: number;
  detectionSources: DetectionSource[];
  remediation: RemediationPlan;
  validation: FindingValidation;
  relatedConfigId: string;
}

export interface ScanRecord {
  id: string;
  configurationName: string;
  deviceId: string;
  device: string;
  vendor: Vendor;
  deviceType: DeviceType;
  health: number;
  issueSummary: IssueSummary;
  date: string;
  status: ScanStatus;
  findingIds: string[];
}

export interface ConfigurationFile {
  id: string;
  name: string;
  deviceId: string;
  device: string;
  vendor: Vendor;
  deviceType: DeviceType;
  lines: string[];
}

export interface DashboardMetric {
  label: string;
  value: string | number;
  tone?: Severity | "success" | "neutral";
  detail: string;
}

export interface ChartDatum {
  name: string;
  value: number;
}

export interface TrendDatum {
  date: string;
  health: number;
}

export interface DashboardData {
  healthScore: number;
  healthStatus: string;
  summary: IssueSummary;
  metrics: DashboardMetric[];
  issueCategories: ChartDatum[];
  severityDistribution: ChartDatum[];
  healthTrend: TrendDatum[];
  recentScans: ScanRecord[];
  criticalFindings: Finding[];
}

export interface TopologyDevice {
  id: string;
  label: string;
  type: "internet" | "router" | "switch" | "firewall" | "client" | "dmz";
  deviceId?: string;
  vendor?: Vendor;
  health?: number;
  findingIds: string[];
  description: string;
}

export interface TopologyLink {
  id: string;
  source: string;
  target: string;
  label?: string;
  severity?: Severity;
}

export interface TopologyData {
  devices: TopologyDevice[];
  links: TopologyLink[];
}

export interface UploadDraft {
  fileName?: string;
  fileSize?: number;
  vendor: Vendor;
  deviceType: DeviceType;
  deviceName: string;
  changeTicket: string;
}
