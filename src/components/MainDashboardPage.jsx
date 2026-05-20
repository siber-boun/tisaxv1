import React from 'react';
import RadarChart from './RadarChart';
import './MainDashboardPage.css';

export default function MainDashboardPage({ onNavigate, assets = [], vulnerabilities = [] }) {
  
  // İstatistikleri Hesapla
  const totalAssets = assets.length;
  const criticalVulns = vulnerabilities.filter(v => v.severity === 'Kritik').length;
  
  const handleNavigate = (viewId) => onNavigate && onNavigate(viewId);

  // Dinamik Renk Hesaplama
  const getProgressColor = (percentage) => {
    if (percentage >= 75) return 'var(--accent-green)';
    if (percentage >= 50) return 'var(--accent-yellow)';
    return 'var(--accent-red)';
  };

  // Mock Radar Verisi (Entegrasyon için)
  const radarScores = { governance: 3, asset_protection: 3, iam: 2, third_party: 1, incident_response: 2, business_continuity: 3, awareness: 4 };

  const scores = [
    { label: "Yönetişim", value: 75 },
    { label: "Varlık Koruması", value: 80 },
    { label: "IAM Güvenliği", value: 60 },
    { label: "Tedarikçi Risk", value: 40 }
  ];

  return (
    <div className="dashboard-console">
      
      {/* 1. ÜST KARŞILAMA VE ÖZET BANDI */}
      <header className="console-header">
        <div className="header-greeting">
          <h2>Merkezi Siber Güvenlik Konsolu</h2>
          <p>Sistem genelinde otomotiv güvenlik duruşunuz anlık olarak izleniyor.</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <small>AKTİF VARLIK</small>
            <span>{totalAssets}</span>
          </div>
          <div className="stat-badge critical">
            <small>KRİTİK ZAFİYET</small>
            <span>{criticalVulns}</span>
          </div>
          <div className="stat-badge compliance">
            <small>GENEL UYUM</small>
            <span>%58</span>
          </div>
        </div>
      </header>

      <div className="console-grid">
        
        {/* 2. SOL GENİŞ BLOK: RADAR ANALİZİ */}
        <div className="console-card radar-main-card" onClick={() => handleNavigate('raporlama')}>
          <div className="card-info">
            <h3>Mevcut Siber Olgunluk Analizi</h3>
            <span className="expand-trigger">Detaylı Rapor ↗</span>
          </div>
          <div className="radar-layout">
            <div className="radar-viz-area">
              <RadarChart scores={radarScores} size={320} />
            </div>
            <div className="radar-legend-area">
              {scores.map(score => (
                <div key={score.label} className="legend-item-pro">
                  <div className="item-label"><span>{score.label}</span><strong>%{score.value}</strong></div>
                  <div className="item-bar">
                    <div className="fill" style={{width: `${score.value}%`, backgroundColor: getProgressColor(score.value)}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. SAĞ ÜST BLOK: RİSK ISI MATRİSİ */}
        <div className="console-card risk-matrix-card" onClick={() => handleNavigate('risk')}>
          <div className="card-info">
            <h3>Canlı TARA & Risk Isı Matrisi</h3>
          </div>
          <div className="matrix-preview">
            <div className="matrix-grid-mini">
              {[...Array(25)].map((_, i) => {
                let cellClass = "";
                if (i === 4 || i === 9) cellClass = "high-risk"; // Top right cells
                if (i === 3) cellClass = "med-risk"; // Medium risk cell
                return <div key={i} className={`matrix-cell-mini ${cellClass}`}></div>;
              })}
            </div>
            <div className="matrix-stats-mini">
              <div className="glow-stat red">
                <div className="dot"></div>
                <span><strong>2</strong> Kritik Risk</span>
              </div>
              <div className="glow-stat yellow">
                <div className="dot"></div>
                <span><strong>1</strong> Orta Risk</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. SOL ALT BLOK: ZAFİYET TAKİBİ */}
        <div className="console-card vuln-card" onClick={() => handleNavigate('zafiyet')}>
          <div className="card-info">
            <h3>Açık Zafiyet Takibi</h3>
          </div>
          <div className="vuln-list-mini">
            {vulnerabilities.slice(0, 3).map(v => (
              <div key={v.id} className="vuln-row-mini">
                <span className={`severity-tag ${v.severity === 'Kritik' ? 'crit' : 'high'}`}>{v.severity}</span>
                <div className="vuln-details-mini">
                  <strong>{v.id}</strong>
                  <small>{v.asset}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. SAĞ ALT BLOK: SERTİFİKASYON İLERLEMESİ */}
        <div className="console-card compliance-card" onClick={() => handleNavigate('tisax')}>
          <div className="card-info">
            <h3>Uyum ve Sertifikasyon</h3>
          </div>
          <div className="circular-viz-row">
            <div className="circle-stat">
              <svg viewBox="0 0 36 36" className="circular-chart blue">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <text x="18" y="20.35" className="percentage">%75</text>
              </svg>
              <span>TISAX Hazırlık</span>
            </div>
            <div className="circle-stat">
              <svg viewBox="0 0 36 36" className="circular-chart green">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle" strokeDasharray="40, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <text x="18" y="20.35" className="percentage">%40</text>
              </svg>
              <span>ISO 21434</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
