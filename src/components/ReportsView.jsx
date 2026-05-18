import React from "react";
import RadarChart from "./RadarChart";
import "./ReportsView.css";

const MOCK_REPORTS = [
  {
    id: 3,
    date: "18.05.2026 14:30",
    scores: {
      governance: 4,
      asset_protection: 3,
      iam: 4,
      third_party: 2,
      incident_response: 4,
      business_continuity: 3,
      awareness: 4,
    },
  },
  {
    id: 2,
    date: "16.05.2026 10:15",
    scores: {
      governance: 3,
      asset_protection: 2,
      iam: 2,
      third_party: 1,
      incident_response: 3,
      business_continuity: 2,
      awareness: 3,
    },
  },
  {
    id: 1,
    date: "14.05.2026 09:00",
    scores: {
      governance: 1,
      asset_protection: 2,
      iam: 1,
      third_party: 0,
      incident_response: 2,
      business_continuity: 1,
      awareness: 2,
    },
  },
];

export default function ReportsView() {
  return (
    <div className="reports-view-container">
      <div className="view-header">
        <h2 className="view-title">Raporlama ve Analiz</h2>
        <p>Kurumunuzun siber olgunluk gelişimini tarihsel olarak takip edin.</p>
      </div>

      <div className="reports-grid">
        {MOCK_REPORTS.map((report) => (
          <div key={report.id} className="report-card">
            <div className="chart-wrapper">
              <RadarChart scores={report.scores} size={300} />
            </div>
            <div className="report-footer">
              <div className="report-date-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>Hesaplama Zamanı: {report.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

