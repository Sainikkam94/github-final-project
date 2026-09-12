import { useMemo, useState } from "react";
import {
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Globe2, Monitor, Network, Router, Shield, SquareStack } from "lucide-react";

import type { Finding, Severity, TopologyData, TopologyDevice } from "@/types";
import { SeverityBadge } from "@/components/common/SeverityBadge";
import { SourceBadge } from "@/components/common/SourceBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, severityMeta, severityOrder, scoreTone } from "@/lib/utils";

type NetworkNodeData = {
  label: JSX.Element;
  topologyId: string;
  severity?: Severity;
};

const positions: Record<string, { x: number; y: number }> = {
  internet: { x: 420, y: 0 },
  core: { x: 420, y: 140 },
  edge: { x: 150, y: 140 },
  switch: { x: 220, y: 300 },
  firewall: { x: 620, y: 300 },
  clients: { x: 220, y: 460 },
  dmz: { x: 620, y: 460 },
};

const typeIcons = {
  internet: Globe2,
  router: Router,
  switch: SquareStack,
  firewall: Shield,
  client: Monitor,
  dmz: Network,
};

function highestSeverity(findingIds: string[], findings: Finding[]): Severity | undefined {
  return findingIds
    .map((id) => findings.find((finding) => finding.id === id)?.severity)
    .filter((severity): severity is Severity => Boolean(severity))
    .sort((a, b) => severityOrder[b] - severityOrder[a])[0];
}

function NodeLabel({
  device,
  severity,
}: {
  device: TopologyDevice;
  severity?: Severity;
}) {
  const Icon = typeIcons[device.type];

  return (
    <div
      className={cn(
        "min-w-[150px] rounded-lg border bg-app-surface p-3 text-left shadow-panel",
        severity ? "border-current" : "border-app-border",
      )}
      style={{ color: severity ? severityMeta[severity].chartColor : "#94A3B8" }}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 flex-none" aria-hidden="true" />
        <span className="truncate text-sm font-bold text-app-text">{device.label}</span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-[11px] uppercase tracking-normal text-app-muted">{device.type}</span>
        {typeof device.health === "number" ? (
          <span className={`font-mono text-xs font-bold ${scoreTone(device.health)}`}>
            {device.health}
          </span>
        ) : null}
      </div>
      {severity ? <div className="mt-2 h-1 rounded-full" style={{ background: severityMeta[severity].chartColor }} /> : null}
    </div>
  );
}

function buildNodes(topology: TopologyData, findings: Finding[]): Node<NetworkNodeData>[] {
  return topology.devices.map((device) => {
    const severity = highestSeverity(device.findingIds, findings);

    return {
      id: device.id,
      type: "default",
      position: positions[device.id] ?? { x: 0, y: 0 },
      data: {
        topologyId: device.id,
        severity,
        label: <NodeLabel device={device} severity={severity} />,
      },
      style: {
        background: "transparent",
        border: "none",
        padding: 0,
        width: 170,
      },
    };
  });
}

function buildEdges(topology: TopologyData): Edge[] {
  return topology.links.map((link) => ({
    id: link.id,
    source: link.source,
    target: link.target,
    label: link.label,
    animated: link.severity === "critical" || link.severity === "high",
    style: {
      stroke: link.severity ? severityMeta[link.severity].chartColor : "#64748B",
      strokeWidth: link.severity === "high" || link.severity === "critical" ? 2.5 : 1.5,
    },
    labelStyle: {
      fill: "#94A3B8",
      fontSize: 11,
      fontWeight: 600,
    },
    labelBgStyle: {
      fill: "#0B0F14",
      fillOpacity: 0.9,
    },
  }));
}

export function NetworkTopology({
  topology,
  findings,
}: {
  topology: TopologyData;
  findings: Finding[];
}) {
  const initialNodes = useMemo(() => buildNodes(topology, findings), [findings, topology]);
  const initialEdges = useMemo(() => buildEdges(topology), [topology]);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [selectedId, setSelectedId] = useState(topology.devices[1]?.id ?? topology.devices[0]?.id);

  const selectedDevice = topology.devices.find((device) => device.id === selectedId) ?? topology.devices[0];
  const selectedFindings = findings.filter((finding) => selectedDevice?.findingIds.includes(finding.id));

  return (
    <div className="grid gap-5 2xl:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader>
          <CardTitle>Network Topology</CardTitle>
          <p className="text-sm text-app-muted">
            Device relationships with severity indicators from the active mock findings set.
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[640px] overflow-hidden rounded-lg border border-app-border bg-[#081018]">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={(_, node) => setSelectedId(node.id)}
              fitView
              minZoom={0.45}
              maxZoom={1.3}
              nodesDraggable
            >
              <Background color="#26313C" gap={24} />
              <Controls position="bottom-left" />
              <MiniMap
                pannable
                zoomable
                nodeColor={(node) => {
                  const severity = (node.data as NetworkNodeData).severity;
                  return severity ? severityMeta[severity].chartColor : "#334155";
                }}
                maskColor="rgba(8, 12, 17, 0.72)"
              />
            </ReactFlow>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Device Inspection</CardTitle>
          <p className="text-sm text-app-muted">Selected topology node details</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedDevice ? (
            <>
              <div className="rounded-lg border border-app-border bg-app-elevated p-4">
                <p className="font-mono text-lg font-bold text-app-text">{selectedDevice.label}</p>
                <p className="mt-1 text-sm text-app-muted">{selectedDevice.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-app-border bg-app-bg px-2.5 py-1 text-xs font-semibold text-app-muted">
                    {selectedDevice.type}
                  </span>
                  {selectedDevice.vendor ? (
                    <span className="rounded-full border border-app-border bg-app-bg px-2.5 py-1 text-xs font-semibold text-app-muted">
                      {selectedDevice.vendor}
                    </span>
                  ) : null}
                  {typeof selectedDevice.health === "number" ? (
                    <span className={`font-mono text-sm font-bold ${scoreTone(selectedDevice.health)}`}>
                      Health {selectedDevice.health}
                    </span>
                  ) : null}
                </div>
              </div>

              {selectedFindings.length ? (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold text-app-text">Associated Findings</h2>
                  {selectedFindings.map((finding) => (
                    <div key={finding.id} className="rounded-lg border border-app-border bg-app-elevated p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <SeverityBadge severity={finding.severity} />
                        <span className="text-xs text-app-muted">{finding.category}</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-app-text">{finding.title}</p>
                      <p className="mt-1 font-mono text-xs text-app-muted">{finding.location.section}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {finding.detectionSources.map((source) => (
                          <SourceBadge key={source} source={source} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-app-border bg-app-elevated p-4 text-sm text-app-muted">
                  No active findings are associated with this topology node.
                </div>
              )}
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
