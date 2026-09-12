export function LoadingState({ label = "Loading data" }: { label?: string }) {
  return (
    <div className="grid min-h-[240px] place-items-center rounded-lg border border-app-border bg-app-surface">
      <div className="space-y-3 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-app-border border-t-app-primary" />
        <p className="text-sm text-app-muted">{label}</p>
      </div>
    </div>
  );
}
