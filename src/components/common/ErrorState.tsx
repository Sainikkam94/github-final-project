import { AlertTriangle } from "lucide-react";

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-app-critical/40 bg-app-critical/10 p-4 text-sm text-red-100">
      <AlertTriangle className="h-5 w-5 flex-none" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
