import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartDatum, TrendDatum } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const severityColors = ["#EF4444", "#F97316", "#EAB308", "#3B82F6", "#94A3B8"];
const categoryColors = ["#60A5FA", "#22C55E", "#EAB308", "#F97316", "#A78BFA", "#94A3B8"];

type TooltipPayload = Array<{ name?: string; value?: number | string; payload?: unknown }>;

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload;
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-app-border bg-app-bg px-3 py-2 text-xs shadow-panel">
      {label ? <p className="mb-1 font-semibold text-app-text">{label}</p> : null}
      {payload.map((entry) => (
        <p key={`${entry.name}-${entry.value}`} className="text-app-muted">
          {entry.name}: <span className="font-semibold text-app-text">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

export function DashboardCharts({
  categories,
  severities,
  trend,
}: {
  categories: ChartDatum[];
  severities: ChartDatum[];
  trend: TrendDatum[];
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <CardHeader>
          <CardTitle>Findings by Category</CardTitle>
          <p className="text-sm text-app-muted">Configuration domains with active review items</p>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categories} margin={{ left: -20, right: 12, top: 6 }}>
              <CartesianGrid stroke="#26313C" vertical={false} />
              <XAxis
                dataKey="name"
                interval={0}
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#26313C" }}
              />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(59,130,246,0.08)" }} />
              <Bar dataKey="value" name="Findings" radius={[6, 6, 0, 0]}>
                {categories.map((entry, index) => (
                  <Cell key={entry.name} fill={categoryColors[index % categoryColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<ChartTooltip />} />
                <Pie
                  data={severities}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={46}
                  outerRadius={74}
                  paddingAngle={2}
                >
                  {severities.map((entry, index) => (
                    <Cell key={entry.name} fill={severityColors[index % severityColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Health Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ left: -20, right: 12, top: 8 }}>
                <CartesianGrid stroke="#26313C" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "#94A3B8", fontSize: 11 }} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fill: "#94A3B8", fontSize: 12 }} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="health"
                  name="Health"
                  stroke="#22C55E"
                  strokeWidth={2}
                  dot={{ fill: "#0B0F14", stroke: "#22C55E", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
