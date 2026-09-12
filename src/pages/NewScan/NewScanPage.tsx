import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  BrainCircuit,
  Check,
  CheckCircle2,
  FileCheck2,
  FileText,
  Network,
  Play,
  Route,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  XCircle,
} from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import type { DeviceType, UploadDraft, Vendor } from "@/types";
import { cn, formatBytes } from "@/lib/utils";

const vendors: Vendor[] = [
  "Cisco IOS",
  "Juniper",
  "Fortinet",
  "SonicWall",
  "Other",
];

const deviceTypes: DeviceType[] = ["Router", "Switch", "Firewall"];

const allowedExtensions = [".cfg", ".conf", ".txt", ".exp"];

const scanChecks = [
  {
    id: "network",
    title: "Network Integrity",
    description: "Interfaces, IPs, subnets and VLAN consistency",
    icon: Network,
  },
  {
    id: "routing",
    title: "Routing & Reachability",
    description: "Routes, next-hops and default gateway checks",
    icon: Route,
  },
  {
    id: "security",
    title: "Security & Hardening",
    description: "Management access, ACLs and protocol exposure",
    icon: ShieldCheck,
  },
  {
    id: "anomaly",
    title: "ML Anomaly Detection",
    description: "Identify unusual configuration patterns",
    icon: BrainCircuit,
  },
  {
    id: "explanation",
    title: "AI Explanation",
    description: "Explain findings and suggest corrective actions",
    icon: Sparkles,
  },
];

function isAllowedFile(file: File) {
  return allowedExtensions.some((extension) =>
    file.name.toLowerCase().endsWith(extension),
  );
}

export function NewScanPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [draft, setDraft] = useState<UploadDraft>({
    vendor: "Cisco IOS",
    deviceType: "Router",
    deviceName: "",
    changeTicket: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [enabledChecks, setEnabledChecks] = useState<string[]>(
    scanChecks.map((check) => check.id),
  );

  const fileIsValid = selectedFile ? isAllowedFile(selectedFile) : false;

 const ready = Boolean(
  selectedFile &&
    fileIsValid &&
    draft.vendor &&
    draft.deviceType &&
    draft.deviceName.trim() &&
    enabledChecks.length > 0,
);

  const status = useMemo(() => {
    if (isSubmitting) {
      return {
        label: "Preparing analysis pipeline",
        detail:
          "Configuration is being passed to the pre-deployment analysis workflow.",
        tone: "text-app-primary",
        icon: ScanSearch,
      };
    }

    if (!selectedFile) {
      return {
        label: "Awaiting configuration",
        detail:
          "Upload a router, switch, or firewall configuration to begin.",
        tone: "text-app-muted",
        icon: FileText,
      };
    }

    if (!fileIsValid) {
      return {
        label: "Unsupported configuration format",
        detail:
          "Accepted formats: .cfg, .conf, .txt and .exp.",
        tone: "text-app-critical",
        icon: AlertTriangle,
      };
    }

    if (!draft.deviceName.trim()) {
      return {
        label: "Configuration loaded",
        detail:
          "Add a device name so the scan can be associated with an asset.",
        tone: "text-app-warning",
        icon: AlertTriangle,
      };
    }

    return {
      label: "Ready for pre-deployment analysis",
      detail:
        "Selected checks will run across the configuration before deployment.",
      tone: "text-app-success",
      icon: CheckCircle2,
    };
  }, [
    draft.deviceName,
    fileIsValid,
    isSubmitting,
    selectedFile,
  ]);

  function handleFile(file?: File) {
    setSelectedFile(file);
  }

  function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
    handleFile(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  }

  function toggleCheck(id: string) {
    setEnabledChecks((current) =>
      current.includes(id)
        ? current.filter((checkId) => checkId !== id)
        : [...current, id],
    );
  }

  function startAnalysis() {
    if (!ready) {
      return;
    }

    setIsSubmitting(true);

    window.setTimeout(() => {
      navigate("/analysis/scan-progress");
    }, 700);
  }

  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="New Scan"
        title="Pre-Deployment Configuration Analysis"
        description="Validate network configuration before deployment using deterministic checks, ML-based anomaly detection, and explainable analysis."
      />

      {/* Workflow */}
      <div className="rounded-xl border border-app-border bg-app-surface px-5 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {([
  ["01", "Configuration", true],
  ["02", "Device Context", false],
  ["03", "Analysis Scope", false],
  ["04", "Review", false],
] as const).map(([number, label, active], index) => (
            <div key={number} className="flex items-center gap-3">
              <div
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full border text-xs font-semibold",
                  active
                    ? "border-app-primary bg-app-primary/15 text-app-primary"
                    : "border-app-border bg-app-bg text-app-muted",
                )}
              >
                {number}
              </div>

              <span
                className={cn(
                  "text-sm font-medium",
                  active ? "text-app-text" : "text-app-muted",
                )}
              >
                {label}
              </span>

              {index < 3 ? (
                <div className="hidden h-px w-12 bg-app-border lg:block" />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        {/* LEFT */}
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>Configuration Source</CardTitle>
                  <p className="mt-1 text-sm text-app-muted">
                    Provide the configuration export that should be validated.
                  </p>
                </div>

                <div className="hidden rounded-lg border border-app-border bg-app-bg px-3 py-2 text-right sm:block">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-app-muted">
                    Accepted
                  </p>
                  <p className="mt-1 font-mono text-xs text-app-text">
                    CFG · CONF · TXT · EXP
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <label
                className={cn(
                  "group flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center transition-all",
                  isDragging
                    ? "border-app-primary bg-app-primary/10"
                    : "border-app-border bg-app-bg hover:border-slate-500 hover:bg-app-elevated",
                  selectedFile && fileIsValid
                    ? "border-app-success/45 bg-app-success/5"
                    : "",
                  selectedFile && !fileIsValid
                    ? "border-app-critical/45 bg-app-critical/5"
                    : "",
                )}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  className="sr-only"
                  type="file"
                  accept=".cfg,.conf,.txt,.exp"
                  onChange={handleFileInput}
                />

                <div
                  className={cn(
                    "grid h-14 w-14 place-items-center rounded-xl border transition-colors",
                    isDragging
                      ? "border-app-primary/50 bg-app-primary/10"
                      : "border-app-border bg-app-surface",
                  )}
                >
                  {selectedFile && fileIsValid ? (
                    <FileCheck2 className="h-7 w-7 text-app-success" />
                  ) : selectedFile ? (
                    <AlertTriangle className="h-7 w-7 text-app-critical" />
                  ) : (
                    <UploadCloud className="h-7 w-7 text-app-muted group-hover:text-app-primary" />
                  )}
                </div>

                <h2 className="mt-5 text-base font-semibold text-app-text">
                  {selectedFile
                    ? selectedFile.name
                    : "Drop configuration export here"}
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-app-muted">
                  {selectedFile
                    ? `${formatBytes(selectedFile.size)} · ${fileIsValid ? "Supported configuration format" : "Unsupported format"}`
                    : "Drag and drop your device configuration, or browse your local files."}
                </p>

                <Button
                  type="button"
                  variant="secondary"
                  className="mt-5"
                  onClick={(event) => {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }}
                >
                  <FileText className="h-4 w-4" />
                  {selectedFile ? "Choose Different File" : "Browse File"}
                </Button>
              </label>

              {selectedFile ? (
                <div className="flex items-center justify-between gap-4 rounded-lg border border-app-border bg-app-elevated px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg border border-app-border bg-app-surface">
                      <FileCheck2 className="h-4 w-4 text-app-success" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-mono text-xs text-app-text">
                        {selectedFile.name}
                      </p>
                      <p className="mt-0.5 text-xs text-app-muted">
                        {formatBytes(selectedFile.size)}
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFile(undefined)}
                  >
                    <XCircle className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Scan scope */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>Analysis Scope</CardTitle>
                  <p className="mt-1 text-sm text-app-muted">
                    Select the validation layers to include in this scan.
                  </p>
                </div>

                <div className="rounded-full border border-app-border bg-app-bg px-3 py-1.5 text-xs text-app-muted">
                  {enabledChecks.length}/{scanChecks.length} enabled
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid gap-3 sm:grid-cols-2">
              {scanChecks.map((check) => {
                const Icon = check.icon;
                const enabled = enabledChecks.includes(check.id);

                return (
                  <button
                    key={check.id}
                    type="button"
                    onClick={() => toggleCheck(check.id)}
                    className={cn(
                      "group flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
                      enabled
                        ? "border-app-primary/40 bg-app-primary/5"
                        : "border-app-border bg-app-bg hover:bg-app-elevated",
                    )}
                  >
                    <div
                      className={cn(
                        "grid h-9 w-9 flex-none place-items-center rounded-lg border",
                        enabled
                          ? "border-app-primary/40 bg-app-primary/10 text-app-primary"
                          : "border-app-border text-app-muted",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-app-text">
                          {check.title}
                        </p>

                        <div
                          className={cn(
                            "grid h-5 w-5 place-items-center rounded border",
                            enabled
                              ? "border-app-primary bg-app-primary text-white"
                              : "border-app-border",
                          )}
                        >
                          {enabled ? <Check className="h-3 w-3" /> : null}
                        </div>
                      </div>

                      <p className="mt-1 text-xs leading-5 text-app-muted">
                        {check.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Device Context</CardTitle>
              <p className="mt-1 text-sm text-app-muted">
                Identify the target device and change context.
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label
                  className="text-sm font-medium text-app-text"
                  htmlFor="vendor"
                >
                  Vendor
                </label>

                <Select
                  id="vendor"
                  value={draft.vendor}
                  onChange={(event) =>
                    setDraft((value) => ({
                      ...value,
                      vendor: event.target.value as Vendor,
                    }))
                  }
                >
                  {vendors.map((vendor) => (
                    <option key={vendor} value={vendor}>
                      {vendor}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid gap-2">
                <label
                  className="text-sm font-medium text-app-text"
                  htmlFor="device-type"
                >
                  Device Type
                </label>

                <Select
                  id="device-type"
                  value={draft.deviceType}
                  onChange={(event) =>
                    setDraft((value) => ({
                      ...value,
                      deviceType: event.target.value as DeviceType,
                    }))
                  }
                >
                  {deviceTypes.map((deviceType) => (
                    <option key={deviceType} value={deviceType}>
                      {deviceType}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid gap-2">
                <label
                  className="text-sm font-medium text-app-text"
                  htmlFor="device-name"
                >
                  Device Name
                </label>

                <Input
                  id="device-name"
                  value={draft.deviceName}
                  placeholder="Example: CORE-RTR-01"
                  onChange={(event) =>
                    setDraft((value) => ({
                      ...value,
                      deviceName: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <label
                  className="text-sm font-medium text-app-text"
                  htmlFor="change-ticket"
                >
                  Change Ticket
                </label>

                <Input
                  id="change-ticket"
                  value={draft.changeTicket}
                  placeholder="Example: CHG-2026-0911"
                  onChange={(event) =>
                    setDraft((value) => ({
                      ...value,
                      changeTicket: event.target.value,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Pipeline preview */}
          <Card>
            <CardHeader>
              <CardTitle>Assurance Pipeline</CardTitle>
              <p className="mt-1 text-sm text-app-muted">
                Findings are produced through multiple analysis layers.
              </p>
            </CardHeader>

            <CardContent>
              <div className="space-y-1">
               {([
  ["01", "Parse Configuration", FileText],
  ["02", "Deterministic Checks", ShieldCheck],
  ["03", "ML Anomaly Detection", BrainCircuit],
  ["04", "Explain & Recommend", Sparkles],
] as const).map(([number, label, Icon]) => (
                  <div
                    key={number}
                    className="flex items-center gap-3 rounded-lg px-3 py-3"
                  >
                    <span className="font-mono text-[11px] text-app-muted">
                      {number}
                    </span>

                    <div className="grid h-8 w-8 place-items-center rounded-lg border border-app-border bg-app-bg">
                      <Icon className="h-4 w-4 text-app-muted" />
                    </div>

                    <span className="text-sm text-app-text">{label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-lg border border-app-primary/20 bg-app-primary/5 p-3">
                <div className="flex gap-3">
                  <ScanSearch className="mt-0.5 h-4 w-4 flex-none text-app-primary" />

                  <p className="text-xs leading-5 text-app-muted">
                    AI explanations are grounded in detected findings and
                    configuration evidence rather than replacing deterministic
                    validation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ready state */}
          <Card>
            <CardHeader>
              <CardTitle>Scan Readiness</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-xl border border-app-border bg-app-bg p-4">
                <div className="flex items-start gap-3">
                  <StatusIcon className={cn("mt-0.5 h-5 w-5", status.tone)} />

                  <div>
                    <p className={cn("text-sm font-semibold", status.tone)}>
                      {status.label}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-app-muted">
                      {status.detail}
                    </p>
                  </div>
                </div>
              </div>

              {isSubmitting ? <Progress value={44} /> : null}

              <Button
                className="w-full"
                size="lg"
                disabled={!ready || isSubmitting}
                onClick={startAnalysis}
              >
                <Play className="h-4 w-4" />
                {isSubmitting ? "Preparing Analysis..." : "Start Analysis"}
              </Button>

              <p className="text-center text-[11px] leading-5 text-app-muted">
                No configuration changes are applied during analysis.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}