import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-app-border bg-app-surface p-8 text-center">
      <Icon className="h-8 w-8 text-app-muted" aria-hidden="true" />
      <h2 className="mt-4 text-base font-semibold text-app-text">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-app-muted">{description}</p>
    </div>
  );
}
