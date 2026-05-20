import React from 'react';

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

export default function RadarChart({ scores, size = 400 }) {
  const center = size / 2;
  const radius = (size / 2) * 0.7;
  const angleStep = (Math.PI * 2) / DIMENSIONS.length;

  // Calculate polygon points
  const points = DIMENSIONS.map((dim, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const score = scores[dim.key] || 0;
    const distance = (score / MAX_SCORE) * radius;
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle),
      labelX: center + (radius + 40) * Math.cos(angle),
      labelY: center + (radius + 25) * Math.sin(angle),
      label: dim.label,
    };
  });

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const gridLevels = [1, 2, 3, 4];

  return (
    <div className="radar-chart-container" style={{ width: '100%', maxWidth: size, margin: '0 auto' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
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
              stroke="var(--border-color)"
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
              stroke="var(--border-color)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Polygon */}
        <polygon
          points={polygonPoints}
          fill="rgba(26, 115, 232, 0.1)"
          stroke="var(--accent-blue)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Data Points */}
        {points.map((p, i) => (
          <circle key={`point-${i}`} cx={p.x} cy={p.y} r="4" fill="var(--accent-blue)" />
        ))}

        {/* Labels */}
        {points.map((p, i) => (
          <text
            key={`label-${i}`}
            x={p.labelX}
            y={p.labelY}
            textAnchor="middle"
            alignmentBaseline="middle"
            fill="var(--text-main)"
            style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', transition: 'fill 0.3s' }}
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
