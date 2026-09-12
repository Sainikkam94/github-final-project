import { useState } from "react";
import type { ReactNode } from "react";
import { Bell, Eye, Info, Palette, ShieldCheck, SlidersHorizontal } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import type { Vendor } from "@/types";

const vendors: Vendor[] = ["Cisco IOS", "Juniper", "Fortinet", "SonicWall", "Other"];

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-app-border bg-app-elevated p-4">
      <span>
        <span className="block text-sm font-semibold text-app-text">{title}</span>
        <span className="mt-1 block text-sm leading-6 text-app-muted">{description}</span>
      </span>
      <input
        type="checkbox"
        className="h-5 w-5 rounded border-app-border bg-app-bg text-app-primary"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

function SettingsSection({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Palette;
  title: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg border border-app-border bg-app-elevated">
            <Icon className="h-4 w-4 text-app-muted" aria-hidden="true" />
          </div>
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

export function SettingsPage() {
  const [defaultVendor, setDefaultVendor] = useState<Vendor>("Cisco IOS");
  const [showConfidence, setShowConfidence] = useState(true);
  const [compactTables, setCompactTables] = useState(false);
  const [notifyCritical, setNotifyCritical] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="System"
        title="Settings"
        description="Local prototype preferences for display, risk visibility, and default analysis choices."
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <SettingsSection icon={Palette} title="Appearance">
          <ToggleRow
            title="Show confidence indicators"
            description="Display confidence values where mock findings include them."
            checked={showConfidence}
            onChange={setShowConfidence}
          />
          <ToggleRow
            title="Compact table density"
            description="Use tighter row spacing for scan and finding tables."
            checked={compactTables}
            onChange={setCompactTables}
          />
        </SettingsSection>

        <SettingsSection icon={SlidersHorizontal} title="Analysis Preferences">
          <div className="grid gap-2 rounded-lg border border-app-border bg-app-elevated p-4">
            <label className="text-sm font-semibold text-app-text" htmlFor="default-vendor">
              Default Vendor
            </label>
            <Select
              id="default-vendor"
              value={defaultVendor}
              onChange={(event) => setDefaultVendor(event.target.value as Vendor)}
            >
              {vendors.map((vendor) => (
                <option key={vendor} value={vendor}>
                  {vendor}
                </option>
              ))}
            </Select>
          </div>
          <ToggleRow
            title="Require approval after validation"
            description="Keep recommended remediation in review state until an engineer approves it."
            checked={requireApproval}
            onChange={setRequireApproval}
          />
        </SettingsSection>

        <SettingsSection icon={Bell} title="Notification Settings">
          <ToggleRow
            title="Notify on critical mock findings"
            description="Surface critical findings in the prototype notification area."
            checked={notifyCritical}
            onChange={setNotifyCritical}
          />
        </SettingsSection>

        <SettingsSection icon={Eye} title="Risk Display">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Critical", "Deployment blocker", "text-app-critical"],
              ["High", "Requires review", "text-app-high"],
              ["Medium", "Planned remediation", "text-app-medium"],
              ["Low / Info", "Operational improvement", "text-app-low"],
            ].map(([label, detail, className]) => (
              <div key={label} className="rounded-lg border border-app-border bg-app-elevated p-4">
                <p className={`text-sm font-bold ${className}`}>{label}</p>
                <p className="mt-1 text-sm text-app-muted">{detail}</p>
              </div>
            ))}
          </div>
        </SettingsSection>

        <SettingsSection icon={Info} title="About ConfigSentinel">
          <div className="rounded-lg border border-app-border bg-app-elevated p-4">
            <p className="text-sm leading-6 text-app-text">
              ConfigSentinel is an AI-powered network configuration assurance frontend prototype
              for academic and industry-style demonstration.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-app-primary/35 bg-app-primary/12 px-3 py-1 text-xs font-semibold text-blue-100">
                Frontend prototype
              </span>
              <span className="rounded-full border border-app-border bg-app-bg px-3 py-1 text-xs font-semibold text-app-muted">
                Mock service layer
              </span>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection icon={ShieldCheck} title="Trust Model">
          <div className="rounded-lg border border-app-border bg-app-elevated p-4">
            <p className="text-sm leading-6 text-app-text">
              Detection, explanation, recommendation, validation, and approval are shown as distinct
              states so remediation remains reviewable and traceable.
            </p>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}
