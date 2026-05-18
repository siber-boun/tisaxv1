import React from "react";
import "./ReportsView.css";

const MOCK_REPORTS = [
  {
    id: 1,
    date: "14.05.2026",
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
  {
    id: 2,
    date: "16.05.2026",
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
    id: 3,
    date: "18.05.2026",
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
];

const DIMENSIONS = [
  { key: "governance", label: "Governance" },
  { key: "asset_protection", label: "Asset Protection" },
  { key: "iam", label: "Identity & Access" },
  { key: "third_party", label: "Third Party" },
  { key: "incident_response", label: "Incident Response" },
  { key: "business_continuity", label: "Business Continuity" },
  { key: "awareness", label: "Awareness" },
];

const MAX_SCORE = 4;

function RadarChart({ data }) {
  const size = 300;
  const center = size / 2;
  const radius = (size / 2) * 0.7; // Leave room for labels
  const angleStep = (Math.PI * 2) / DIMENSIONS.length;

  const points = DIMENSIONS.map((dim, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const score = data.scores[dim.key] || 0;
    const distance = (score / MAX_SCORE) * radius;
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle),
      labelX: center + (radius + 25) * Math.cos(angle),
      labelY: center + (radius + 20) * Math.sin(angle),
      label: dim.label,
    };
  });

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Background grid (concentric polygons)
  const gridLevels = [1, 2, 3, 4];
  
  return (
    <div className="radar-chart-container">
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="radar-svg">
        {/* Background Grid */}
        {gridLevels.map((level) => {
          const levelRadius = (level / MAX_SCORE) * radius;
          const levelPoints = DIMENSIONS.map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            return `${center + levelRadius * Math.cos(angle)},${center + levelRadius * Math.sin(angle)}`;
          }).join(" ");
          return (
            <polygon
              key={`grid-${level}`}
              points={levelPoints}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        {/* Axes */}
        {DIMENSIONS.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Polygon */}
        <polygon
          points={polygonPoints}
          fill="rgba(13, 138, 128, 0.2)"
          stroke="#0d8a80"
          strokeWidth="2"
        />

        {/* Data Points */}
        {points.map((p, i) => (
          <circle key={`point-${i}`} cx={p.x} cy={p.y} r="4" fill="#0f5f9c" />
        ))}

        {/* Labels */}
        {points.map((p, i) => (
          <text
            key={`label-${i}`}
            x={p.labelX}
            y={p.labelY}
            textAnchor="middle"
            alignmentBaseline="middle"
            fill="#475569"
            fontSize="10px"
            fontWeight="600"
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default function ReportsView() {
  return (
    <div className="reports-view-container">
      <div className="reports-header">
        <h2>Geçmiş Analiz Raporları</h2>
        <p>Kurumunuzun daha önce tamamlamış olduğu siber olgunluk değerlendirme sonuçları.</p>
      </div>

      <div className="reports-grid">
        {MOCK_REPORTS.map((report) => (
          <div key={report.id} className="report-card">
            <div className="chart-wrapper">
              <RadarChart data={report} />
            </div>
            <div className="report-footer">
              <span className="report-date-label">Tamamlanma Tarihi:</span>
              <span className="report-date-value">{report.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
