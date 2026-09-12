import { Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/layout/AppShell";
import { AnalysisPage } from "@/pages/Analysis/AnalysisPage";
import { DashboardPage } from "@/pages/Dashboard/DashboardPage";
import { FindingDetailsPage } from "@/pages/FindingDetails/FindingDetailsPage";
import { FindingsPage } from "@/pages/Findings/FindingsPage";
import { HistoryPage } from "@/pages/History/HistoryPage";
import { NewScanPage } from "@/pages/NewScan/NewScanPage";
import { ReportsPage } from "@/pages/Reports/ReportsPage";
import { SettingsPage } from "@/pages/Settings/SettingsPage";
import { TopologyPage } from "@/pages/Topology/TopologyPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/scan/new" element={<NewScanPage />} />
        <Route path="/analysis/:scanId" element={<AnalysisPage />} />
        <Route path="/findings" element={<FindingsPage />} />
        <Route path="/findings/:findingId" element={<FindingDetailsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/topology" element={<TopologyPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
