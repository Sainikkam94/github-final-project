import { useMemo, useState } from "react";
import { Check, Copy, Search } from "lucide-react";

import type { ConfigurationFile, LocationRef } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ConfigViewerProps {
  configuration: ConfigurationFile;
  highlightedLocation?: LocationRef;
}

export function ConfigViewer({ configuration, highlightedLocation }: ConfigViewerProps) {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const normalizedSearch = search.trim().toLowerCase();
  const lineStart = highlightedLocation?.lineStart ?? -1;
  const lineEnd = highlightedLocation?.lineEnd ?? lineStart;

  const lines = useMemo(
    () =>
      configuration.lines.map((line, index) => {
        const lineNumber = index + 1;
        const highlighted = lineNumber >= lineStart && lineNumber <= lineEnd;
        const searchMatch = Boolean(normalizedSearch && line.toLowerCase().includes(normalizedSearch));

        return { line, lineNumber, highlighted, searchMatch };
      }),
    [configuration.lines, lineEnd, lineStart, normalizedSearch],
  );

  async function copyConfiguration() {
    await navigator.clipboard.writeText(configuration.lines.join("\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Related Configuration</CardTitle>
            <p className="mt-1 font-mono text-xs text-app-muted">
              {configuration.name} / {configuration.device}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
              <Input
                aria-label="Search configuration"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search configuration"
                className="w-full pl-9 sm:w-64"
              />
            </div>
            <Button variant="secondary" onClick={copyConfiguration}>
              {copied ? (
                <Check className="h-4 w-4 text-app-success" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[560px] overflow-auto rounded-lg border border-app-border bg-[#080C11]">
          <pre className="min-w-[760px] py-3 text-sm leading-6">
            {lines.map(({ line, lineNumber, highlighted, searchMatch }) => (
              <div
                key={lineNumber}
                className={cn(
                  "grid grid-cols-[56px_1fr] px-3 font-mono",
                  highlighted ? "bg-app-critical/16 text-red-50" : "text-slate-300",
                  searchMatch && !highlighted ? "bg-app-primary/12 text-blue-50" : "",
                )}
              >
                <span className="select-none border-r border-app-border pr-3 text-right text-xs text-slate-500">
                  {String(lineNumber).padStart(2, "0")}
                </span>
                <code className="pl-3">{line || " "}</code>
              </div>
            ))}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
