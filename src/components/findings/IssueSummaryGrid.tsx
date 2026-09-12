import type { IssueSummary } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

const summaryItems: Array<{
  key: keyof IssueSummary;
  label: string;
  className: string;
}> = [
  { key: "critical", label: "Critical", className: "text-app-critical" },
  { key: "high", label: "High", className: "text-app-high" },
  { key: "medium", label: "Medium", className: "text-app-medium" },
  { key: "low", label: "Low / Informational", className: "text-app-low" },
  { key: "passed", label: "Passed", className: "text-app-success" },
];

export function IssueSummaryGrid({ summary }: { summary: IssueSummary }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {summaryItems.map((item) => (
        <Card key={item.key}>
          <CardContent className="p-4">
            <p className="text-sm text-app-muted">{item.label}</p>
            <p className={`mt-2 text-2xl font-bold tracking-normal ${item.className}`}>
              {summary[item.key]}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
