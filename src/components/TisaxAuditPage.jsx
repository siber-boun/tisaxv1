import React, { useState } from 'react';
import './TisaxAuditPage.css';
import { Icons } from './Icons';

const ISA_CONTROLS = [
  { id: '1.1', item: 'Bilgi Güvenliği Politikaları', status: 'Politikalar yayınlandı, yönetim onayı alındı.' },
  { id: '1.2', item: 'Bilgi Güvenliği Organizasyonu', status: 'Roller ve sorumluluklar tanımlandı.' },
  { id: '2.1', item: 'İnsan Kaynakları Güvenliği', status: 'İşe alım öncesi taramalar yapılıyor.' },
  { id: '3.1', item: 'Varlık Yönetimi', status: 'Kritik varlık envanteri oluşturuldu.' },
  { id: '4.1', item: 'Erişim Kontrolü', status: 'MFA uygulaması yaygınlaştırılıyor.' },
  { id: '5.2', item: 'Fiziksel Güvenlik', status: 'Giriş kartı ve kamera sistemi aktif.' }
];

const CERT_LABELS = [
  { id: 1, title: 'Bilgi Güvenliği (AL2)', level: 'High', status: 'Ready', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  { id: 2, title: 'Prototip Koruması (AL3)', level: 'Very High', status: 'Missing', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  { id: 3, title: 'Veri Koruma', level: 'GDPR/KVKK', status: 'Ready', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
];

// Simple SVG Bar Chart Component
const MaturityBarChart = ({ scores }) => {
  const chartHeight = 200;
  const chartWidth = 500;
  const targetLineY = chartHeight - (3 / 5) * chartHeight;

  return (
    <div className="tisax-chart-container">
      <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`} style={{ overflow: 'visible' }}>
        {/* Grid Lines */}
        {[0, 1, 2, 3, 4, 5].map(l => {
          const y = chartHeight - (l / 5) * chartHeight;
          return (
            <g key={l}>
              <line x1="0" y1={y} x2={chartWidth} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
              <text x="-15" y={y + 5} fontSize="10" fill="#94a3b8">{l}</text>
            </g>
          );
        })}

        {/* Target Score Line (Level 3) */}
        <line x1="0" y1={targetLineY} x2={chartWidth} y2={targetLineY} stroke="#10b981" strokeWidth="2" />
        <text x={chartWidth + 5} y={targetLineY + 5} fontSize="10" fill="#059669" fontWeight="bold">Hedef (Lvl 3)</text>

        {/* Bars */}
        {Object.entries(scores).map(([key, val], i) => {
          const barWidth = 40;
          const spacing = (chartWidth / Object.keys(scores).length);
          const x = i * spacing + (spacing / 2) - (barWidth / 2);
          const h = (val / 5) * chartHeight;
          const y = chartHeight - h;

          return (
            <g key={key}>
              <rect x={x} y={y} width={barWidth} height={h} fill={val >= 3 ? '#2563eb' : '#94a3b8'} rx="4" />
              <text x={x + barWidth / 2} y={chartHeight + 20} textAnchor="middle" fontSize="10" fill="#64748b">{key}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default function TisaxAuditPage() {
  const [activeTab, setActiveTab] = useState('readiness');
  const [scores, setScores] = useState({ '1.1': 3, '1.2': 2, '2.1': 4, '3.1': 3, '4.1': 1, '5.2': 2 });

  const handleScoreChange = (id, val) => {
    setScores({ ...scores, [id]: Number(val) });
  };

  return (
    <div className="tisax-container">
      <div className="tisax-header">
        <div className="tisax-title-row">
          <h2>TISAX Uyum Yönetimi</h2>
          <span className="tisax-version-badge">VDA ISA 6.0</span>
        </div>
        <p>Otomotiv endüstrisi bilgi güvenliği gereksinimlerini ve olgunluk seviyelerini takip edin.</p>
      </div>

      <div className="tisax-tabs">
        <button className={activeTab === 'readiness' ? 'active' : ''} onClick={() => setActiveTab('readiness')}>Readiness Assessment</button>
        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>Maturity Dashboard</button>
        <button className={activeTab === 'labels' ? 'active' : ''} onClick={() => setActiveTab('labels')}>Labels & Status</button>
      </div>

      <div className="tisax-content">
        {activeTab === 'readiness' && (
          <div className="tisax-card">
            <table className="tisax-table">
              <thead>
                <tr>
                  <th>Kontrol Maddesi</th>
                  <th>Mevcut Durum Özeti</th>
                  <th>Olgunluk Skoru</th>
                  <th>Hedef</th>
                  <th>Aksiyonlar</th>
                </tr>
              </thead>
              <tbody>
                {ISA_CONTROLS.map((c) => {
                  const score = scores[c.id];
                  const rowClass = score >= 3 ? 'row-compliant' : (score > 0 ? 'row-partial' : 'row-noncompliant');
                  return (
                    <tr key={c.id} className={rowClass}>
                      <td><strong>{c.id} - {c.item}</strong></td>
                      <td><small>{c.status}</small></td>
                      <td>
                        <select className="tisax-select" value={scores[c.id]} onChange={(e) => handleScoreChange(c.id, e.target.value)}>
                          {[0, 1, 2, 3, 4, 5].map(v => <option key={v} value={v}>Level {v}</option>)}
                        </select>
                      </td>
                      <td><span className="target-badge">Lvl 3</span></td>
                      <td className="actions-cell">
                        <button className="action-btn btn-edit" title="Düzenle"><Icons.Edit size={14}/></button>
                        <button className="action-btn btn-delete" title="Sil"><Icons.Trash size={14}/></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="tisax-card dashboard-panel">
            <h3>Bölüm Bazlı Olgunluk Analizi</h3>
            <p>Mevcut durumunuzun hedef seviye (Level 3) ile karşılaştırmalı analizi.</p>
            <MaturityBarChart scores={scores} />
          </div>
        )}

        {activeTab === 'labels' && (
          <div className="tisax-labels-grid">
            {CERT_LABELS.map((label) => (
              <div key={label.id} className={`label-card ${label.status.toLowerCase()}`}>
                <div className="label-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={label.icon} /></svg>
                </div>
                <div className="label-info">
                  <h4>{label.title}</h4>
                  <p>Protection Need: <strong>{label.level}</strong></p>
                </div>
                <div className={`status-pill ${label.status.toLowerCase()}`}>
                  {label.status === 'Ready' ? 'Hazır' : 'Eksik'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
