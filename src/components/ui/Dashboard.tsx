"use client";

import React, { useState } from "react";
import { TableAnalysisResult } from "@/types";

interface DashboardProps {
  analysisResults: TableAnalysisResult[];
  solarTableNames: Record<string, string>; // tableId -> display name
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Optimal: { bg: "#dcfce7", text: "#15803d" },
  "Partially Shaded": { bg: "#fef9c3", text: "#a16207" },
  "Heavily Shaded": { bg: "#fee2e2", text: "#b91c1c" },
};

export default function Dashboard({ analysisResults, solarTableNames }: DashboardProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  if (analysisResults.length === 0) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Analytics Dashboard</h2>
          <p className="dashboard-subtitle">Shadow analysis initializing…</p>
        </div>
      </div>
    );
  }

  // Global stats
  const allPanels = analysisResults.flatMap((t) => t.panels);
  const globalAvgEfficiency =
    allPanels.reduce((s, p) => s + p.finalEfficiency, 0) / allPanels.length;
  const globalAvgShadow =
    allPanels.reduce((s, p) => s + p.shadowPercentage, 0) / allPanels.length;
  const shadedCount = allPanels.filter((p) => p.shadowPercentage > 10).length;

  const toggleTable = (tableId: string) =>
    setExpanded((prev) => ({ ...prev, [tableId]: !prev[tableId] }));

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">Analytics Dashboard</h2>
        <p className="dashboard-subtitle">Live shadow &amp; efficiency analysis</p>
      </div>

      {/* Global Summary Row */}
      <div className="dashboard-summary-grid">
        <div className="summary-card">
          <div className="summary-value">{globalAvgEfficiency.toFixed(1)}%</div>
          <div className="summary-label">Avg Efficiency</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{globalAvgShadow.toFixed(1)}%</div>
          <div className="summary-label">Avg Shadow</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{allPanels.length}</div>
          <div className="summary-label">Total Panels</div>
        </div>
        <div className="summary-card">
          <div className="summary-value" style={{ color: shadedCount > 0 ? "#ef4444" : "#22c55e" }}>
            {shadedCount}
          </div>
          <div className="summary-label">Shaded Panels</div>
        </div>
      </div>

      {/* Per Table Section */}
      {analysisResults.map((table) => {
        const name = solarTableNames[table.tableId] ?? table.tableId;
        const isOpen = expanded[table.tableId] !== false; // open by default

        return (
          <div key={table.tableId} className="dashboard-table-card">
            {/* Table Header */}
            <button
              className="dashboard-table-header"
              onClick={() => toggleTable(table.tableId)}
              type="button"
            >
              <span className="dashboard-table-name">{name}</span>
              <div className="dashboard-table-meta">
                <span className="meta-pill meta-eff">
                  {table.averageEfficiency.toFixed(1)}% eff
                </span>
                <span className="meta-pill meta-shadow">
                  {table.averageShadowPercentage.toFixed(1)}% shadow
                </span>
                <span className="chevron" style={{ fontSize: "0.65rem" }}>
                  {isOpen ? "▲" : "▼"}
                </span>
              </div>
            </button>

            {isOpen && (
              <div className="dashboard-table-body">
                {/* Table-level metrics */}
                <div className="table-metrics-row">
                  <div className="table-metric">
                    <span className="table-metric-label">Total Panels</span>
                    <span className="table-metric-value">{table.panels.length}</span>
                  </div>
                  <div className="table-metric">
                    <span className="table-metric-label">Shaded</span>
                    <span className="table-metric-value" style={{ color: "#ef4444" }}>
                      {table.panels.filter((p) => p.shadowPercentage > 10).length}
                    </span>
                  </div>
                  <div className="table-metric">
                    <span className="table-metric-label">Best</span>
                    <span className="table-metric-value" style={{ color: "#22c55e" }}>
                      {table.bestPanelId.split("-").slice(-2).join("-")}
                    </span>
                  </div>
                  <div className="table-metric">
                    <span className="table-metric-label">Worst</span>
                    <span className="table-metric-value" style={{ color: "#ef4444" }}>
                      {table.worstPanelId.split("-").slice(-2).join("-")}
                    </span>
                  </div>
                </div>

                {/* Per Panel Table */}
                <table className="panel-table">
                  <thead>
                    <tr>
                      <th>Panel</th>
                      <th>Shadow %</th>
                      <th>Efficiency %</th>
                      <th>EOF</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.panels.map((panel) => {
                      const sc = STATUS_COLORS[panel.status] ?? STATUS_COLORS["Optimal"];
                      const shortId = panel.panelId.split("-").slice(-2).join("-");
                      return (
                        <tr key={panel.panelId}>
                          <td className="panel-id">{shortId}</td>
                          <td>{panel.shadowPercentage.toFixed(0)}%</td>
                          <td>{panel.finalEfficiency.toFixed(1)}%</td>
                          <td>{panel.eof.toFixed(2)}</td>
                          <td>
                            <span
                              className="status-badge"
                              style={{ background: sc.bg, color: sc.text }}
                            >
                              {panel.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
