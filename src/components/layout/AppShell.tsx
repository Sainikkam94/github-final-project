import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  FileClock,
  FileText,
  Gauge,
  History,
  Menu,
  Network,
  Radar,
  Search,
  Settings,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  path: string;
  icon: typeof Gauge;
  aliases?: string[];
};

const sections: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", path: "/dashboard", icon: Gauge, aliases: ["/"] }],
  },
  {
    label: "Analysis",
    items: [
      { label: "New Scan", path: "/scan/new", icon: UploadCloud },
      { label: "Findings", path: "/findings", icon: Radar, aliases: ["/findings/"] },
      { label: "Topology", path: "/topology", icon: Network },
    ],
  },
  {
    label: "Management",
    items: [
      { label: "Scan History", path: "/history", icon: History, aliases: ["/analysis/"] },
      { label: "Reports", path: "/reports", icon: FileText },
    ],
  },
  {
    label: "System",
    items: [{ label: "Settings", path: "/settings", icon: Settings }],
  },
];

const pageTitles = [
  { match: /^\/$/, title: "Configuration Overview" },
  { match: /^\/dashboard/, title: "Configuration Overview" },
  { match: /^\/scan\/new/, title: "New Pre-Deployment Scan" },
  { match: /^\/analysis\//, title: "Analysis Results" },
  { match: /^\/findings\/.+/, title: "Finding Details" },
  { match: /^\/findings/, title: "Findings" },
  { match: /^\/history/, title: "Scan History" },
  { match: /^\/reports/, title: "Reports" },
  { match: /^\/topology/, title: "Topology" },
  { match: /^\/settings/, title: "Settings" },
];

function SidebarContent({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-app-border px-4">
        <div className="grid h-9 w-9 flex-none place-items-center rounded-lg border border-app-primary/40 bg-app-primary/15">
          <ShieldCheck className="h-5 w-5 text-blue-200" aria-hidden="true" />
        </div>
        {!collapsed ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-app-text">ConfigSentinel</p>
            <p className="truncate text-xs text-app-muted">Configuration Assurance</p>
          </div>
        ) : null}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Primary navigation">
        <div className="space-y-5">
          {sections.map((section) => (
            <div key={section.label}>
              {!collapsed ? (
                <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-normal text-slate-500">
                  {section.label}
                </p>
              ) : null}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.path ||
                    item.aliases?.some((alias) =>
                      alias.endsWith("/") && alias.length > 1
                        ? location.pathname.startsWith(alias)
                        : location.pathname === alias,
                    );

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      title={collapsed ? item.label : undefined}
                      onClick={onNavigate}
                      className={cn(
                        "flex h-10 items-center rounded-lg border border-transparent px-3 text-sm font-medium transition-colors",
                        collapsed ? "justify-center" : "gap-3",
                        isActive
                          ? "border-app-primary/35 bg-app-primary/12 text-blue-100"
                          : "text-app-muted hover:bg-app-elevated hover:text-app-text",
                      )}
                    >
                      <Icon className="h-4 w-4 flex-none" aria-hidden="true" />
                      {!collapsed ? <span className="truncate">{item.label}</span> : null}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="border-t border-app-border p-4">
        <div
          className={cn(
            "flex items-center rounded-lg border border-app-success/30 bg-app-success/10",
            collapsed ? "justify-center p-2" : "gap-3 p-3",
          )}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-app-success shadow-[0_0_12px_rgba(34,197,94,0.35)]" />
          {!collapsed ? (
            <div className="min-w-0">
              <p className="text-xs font-semibold text-green-100">System Online</p>
              <p className="truncate text-[11px] text-green-200/70">Mock services active</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Topbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const location = useLocation();
  const title = useMemo(
    () => pageTitles.find((entry) => entry.match.test(location.pathname))?.title ?? "ConfigSentinel",
    [location.pathname],
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-app-border bg-app-bg/95 px-4 backdrop-blur md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenMobile}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-app-text">{title}</p>
          <p className="hidden truncate text-xs text-app-muted sm:block">
            AI-powered network configuration assurance prototype
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden h-9 items-center gap-2 rounded-lg border border-app-border bg-app-surface px-3 md:flex">
          <Search className="h-4 w-4 text-app-muted" aria-hidden="true" />
          <input
            aria-label="Search ConfigSentinel"
            className="w-56 bg-transparent text-sm text-app-text placeholder:text-slate-500 focus:outline-none"
            placeholder="Search findings, devices, scans"
          />
        </div>
        <Button variant="ghost" size="icon" aria-label="View notifications" title="Notifications">
          <Bell className="h-5 w-5" aria-hidden="true" />
        </Button>
        <div className="hidden items-center gap-2 rounded-lg border border-app-border bg-app-surface px-3 py-2 sm:flex">
          <FileClock className="h-4 w-4 text-app-muted" aria-hidden="true" />
          <div>
            <p className="text-xs font-semibold text-app-text">NetOps Demo</p>
            <p className="text-[11px] text-app-muted">Engineer</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-app-bg text-app-text">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-app-border bg-app-surface transition-[width] duration-200 lg:block",
          sidebarCollapsed ? "w-[76px]" : "w-[272px]",
        )}
      >
        <SidebarContent collapsed={sidebarCollapsed} />
        <Button
          variant="secondary"
          size="icon"
          className="absolute -right-4 top-20 h-8 w-8 rounded-full"
          onClick={() => setSidebarCollapsed((value) => !value)}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation overlay"
          />
          <aside className="relative h-full w-[280px] border-r border-app-border bg-app-surface">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3 z-10"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Button>
            <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div
        className={cn(
          "min-h-screen transition-[padding] duration-200",
          sidebarCollapsed ? "lg:pl-[76px]" : "lg:pl-[272px]",
        )}
      >
        <Topbar onOpenMobile={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 md:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
