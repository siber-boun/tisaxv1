import React, { useState, useEffect } from 'react';
import './RiskManagementPage.css';

// Parent'tan assets prop'u gelmezse kullanılacak fallback veriler
const MOCK_ASSETS = [
  { id: "V-1001", name: "Sunucu", location: "Veri Merkezi - Sistem Odası", cia: { c: 3, i: 3, a: 3 } },
  { id: "V-1002", name: "Kullanıcı Bilgisayarı", location: "Mühendislik Departmanı", cia: { c: 2, i: 2, a: 2 } },
  { id: "V-1003", name: "Laptop", location: "Yönetim Ofisi", cia: { c: 3, i: 2, a: 2 } },
  { id: "V-1004", name: "Switch ve Ağ Cihazları", location: "Omurga Kabini - Kat 1", cia: { c: 1, i: 2, a: 3 } }
];

export default function RiskManagementPage({ assets = MOCK_ASSETS }) {
  // Her varlık için Olasılık ve Etki değerlerini tutan yerel state
  const [riskData, setRiskData] = useState({});

  // Bileşen yüklendiğinde varsayılan etki (Impact) değerini CIA'in maksimumundan al
  useEffect(() => {
    const initialRiskData = {};
    assets.forEach(asset => {
      let maxCia = 1;
      if (asset.cia) {
        maxCia = Math.max(asset.cia.c || 1, asset.cia.i || 1, asset.cia.a || 1);
      }
      initialRiskData[asset.id] = {
        likelihood: 2, // Varsayılan olasılık (Düşük)
        impact: maxCia // CIA max değeri varsayılan iş etkisi olur
      };
    });
    setRiskData(initialRiskData);
  }, [assets]);

  const handleRiskChange = (assetId, field, value) => {
    setRiskData(prev => ({
      ...prev,
      [assetId]: {
        ...prev[assetId],
        [field]: Number(value)
      }
    }));
  };

  const getRiskLevel = (score) => {
    if (score >= 15) return { label: 'Yüksek / Kritik', class: 'risk-high' };
    if (score >= 9) return { label: 'Orta', class: 'risk-medium' };
    return { label: 'Düşük', class: 'risk-low' };
  };

  const getCiaLabel = (val) => {
    if (val === 3) return "Yüksek";
    if (val === 2) return "Orta";
    return "Düşük";
  };

  const getCiaClass = (val) => {
    if (val === 3) return "cia-high";
    if (val === 2) return "cia-medium";
    return "cia-low";
  };

  // Dashboard İstatistiklerini Hesapla
  let highRiskCount = 0;
  let topRiskAsset = { name: '-', score: 0 };

  const enrichedAssets = assets.map(asset => {
    const data = riskData[asset.id] || { likelihood: 2, impact: 1 };
    const score = data.likelihood * data.impact;
    const level = getRiskLevel(score);
    
    if (score >= 15) highRiskCount++;
    if (score > topRiskAsset.score) {
      topRiskAsset = { name: asset.name, score };
    }

    return { ...asset, riskData: data, score, level };
  });

  return (
    <div className="rm-container">
      <div className="rm-header">
        <h2>Risk Yönetimi</h2>
        <p>Bilgi varlıklarınızın tehdit olasılığı ve iş etkisine göre risk skorlarını yönetin.</p>
      </div>

      {/* Genel Durum Paneli (Dashboard Widget) */}
      <div className="rm-dashboard">
        <div className="rm-widget">
          <div className="rm-widget-icon red-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div className="rm-widget-content">
            <span className="rm-widget-label">Yüksek/Kritik Riskli Varlıklar</span>
            <span className="rm-widget-value">{highRiskCount} <small>Adet</small></span>
          </div>
        </div>
        <div className="rm-widget">
          <div className="rm-widget-icon blue-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div className="rm-widget-content">
            <span className="rm-widget-label">En Kritik Varlık (Tepe Risk)</span>
            <span className="rm-widget-value" style={{fontSize: '1.25rem'}}>{topRiskAsset.name} <small>(Skor: {topRiskAsset.score})</small></span>
          </div>
        </div>
      </div>

      {/* Risk Tablosu */}
      <div className="rm-table-card">
        <div className="rm-table-wrapper">
          <table className="rm-table">
            <thead>
              <tr>
                <th>Varlık & Lokasyon</th>
                <th>Kritiklik Göstergesi (CIA)</th>
                <th>Tehdit Olasılığı (1-5)</th>
                <th>İş Etkisi (1-5)</th>
                <th>Risk Skoru</th>
                <th>Risk Seviyesi</th>
              </tr>
            </thead>
            <tbody>
              {enrichedAssets.map((asset) => (
                <tr key={asset.id}>
                  <td>
                    <div className="rm-asset-info">
                      <strong>{asset.name}</strong>
                      <small>{asset.location}</small>
                    </div>
                  </td>
                  <td>
                    {asset.cia ? (
                      <div className="rm-cia-badges">
                        <span className={`rm-cia-badge ${getCiaClass(asset.cia.c)}`} title="Gizlilik">C: {getCiaLabel(asset.cia.c)}</span>
                        <span className={`rm-cia-badge ${getCiaClass(asset.cia.i)}`} title="Bütünlük">I: {getCiaLabel(asset.cia.i)}</span>
                        <span className={`rm-cia-badge ${getCiaClass(asset.cia.a)}`} title="Erişilebilirlik">A: {getCiaLabel(asset.cia.a)}</span>
                      </div>
                    ) : (
                      <span className="text-muted">CIA Girilmemiş</span>
                    )}
                  </td>
                  <td>
                    <select 
                      className="rm-select"
                      value={asset.riskData.likelihood} 
                      onChange={(e) => handleRiskChange(asset.id, 'likelihood', e.target.value)}
                    >
                      <option value="1">1 - Çok Düşük</option>
                      <option value="2">2 - Düşük</option>
                      <option value="3">3 - Orta</option>
                      <option value="4">4 - Yüksek</option>
                      <option value="5">5 - Çok Yüksek</option>
                    </select>
                  </td>
                  <td>
                    <select 
                      className="rm-select"
                      value={asset.riskData.impact} 
                      onChange={(e) => handleRiskChange(asset.id, 'impact', e.target.value)}
                    >
                      <option value="1">1 - Sınırlı</option>
                      <option value="2">2 - Orta</option>
                      <option value="3">3 - Ciddi</option>
                      <option value="4">4 - Kritik</option>
                      <option value="5">5 - Felaket</option>
                    </select>
                  </td>
                  <td>
                    <div className="rm-score-display">
                      <span className="rm-score-number">{asset.score}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`rm-risk-badge ${asset.level.class}`}>
                      {asset.level.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
