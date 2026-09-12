import { SearchX } from "lucide-react";

import type { Finding } from "@/types";
import { EmptyState } from "@/components/common/EmptyState";
import { FindingCard } from "./FindingCard";

export function FindingList({ findings }: { findings: Finding[] }) {
  if (!findings.length) {
    return (
      <EmptyState
        icon={SearchX}
        title="No findings match the current filters"
        description="Adjust severity, category, vendor, device, or detection source filters to review additional mock findings."
      />
    );
  }

  return (
    <div className="space-y-3">
      {findings.map((finding) => (
        <FindingCard key={finding.id} finding={finding} />
      ))}
    </div>
  );
}
