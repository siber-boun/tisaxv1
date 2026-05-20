import React, { useState, useEffect } from 'react';
import './RiskManagementPage.css';
import { Icons } from './Icons';

const MOCK_ASSETS = [
  { id: "V-1001", name: "Sunucu", location: "Veri Merkezi - Sistem Odası", cia: { c: 3, i: 3, a: 3 } },
  { id: "V-1002", name: "Kullanıcı Bilgisayarı", location: "Mühendislik Departmanı", cia: { c: 2, i: 2, a: 2 } },
  { id: "V-1003", name: "Laptop", location: "Yönetim Ofisi", cia: { c: 3, i: 2, a: 2 } },
  { id: "V-1004", name: "Switch ve Ağ Cihazları", location: "Omurga Kabini - Kat 1", cia: { c: 1, i: 2, a: 3 } }
];

export default function RiskManagementPage({ assets = MOCK_ASSETS }) {
  const [riskData, setRiskData] = useState({});

  useEffect(() => {
    const initialRiskData = {};
    assets.forEach(asset => {
      let maxCia = 1;
      if (asset.cia) {
        maxCia = Math.max(asset.cia.c || 1, asset.cia.i || 1, asset.cia.a || 1);
      }
      initialRiskData[asset.id] = {
        likelihood: 2,
        impact: maxCia
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

  const getRiskRowClass = (score) => {
    if (score >= 12) return 'row-risk-high';
    if (score >= 6) return 'row-risk-med';
    return 'row-risk-low';
  };

  const enrichedAssets = assets.map(asset => {
    const data = riskData[asset.id] || { likelihood: 2, impact: 1 };
    const score = data.likelihood * data.impact;
    return { ...asset, riskData: data, score };
  });

  return (
    <div className="rm-container">
      <div className="rm-header">
        <h2>Risk Yönetimi & TARA Analizi</h2>
        <p>Bilgi varlıklarınızın tehdit olasılığı ve iş etkisine göre risk skorlarını yönetin.</p>
      </div>

      <div className="rm-table-card">
        <div className="rm-table-wrapper">
          <table className="rm-table">
            <thead>
              <tr>
                <th>Varlık & Lokasyon</th>
                <th>Tehdit Olasılığı (1-5)</th>
                <th>İş Etkisi (1-5)</th>
                <th>Risk Skoru</th>
                <th style={{textAlign: 'right'}}>Aksiyonlar</th>
              </tr>
            </thead>
            <tbody>
              {enrichedAssets.map((asset) => (
                <tr key={asset.id} className={getRiskRowClass(asset.score)}>
                  <td>
                    <div className="rm-asset-info">
                      <strong>{asset.name}</strong>
                      <small>{asset.location}</small>
                    </div>
                  </td>
                  <td>
                    <select className="rm-select" value={asset.riskData.likelihood} onChange={(e) => handleRiskChange(asset.id, 'likelihood', e.target.value)}>
                      <option value="1">1 - Çok Düşük</option>
                      <option value="2">2 - Düşük</option>
                      <option value="3">3 - Orta</option>
                      <option value="4">4 - Yüksek</option>
                      <option value="5">5 - Çok Yüksek</option>
                    </select>
                  </td>
                  <td>
                    <select className="rm-select" value={asset.riskData.impact} onChange={(e) => handleRiskChange(asset.id, 'impact', e.target.value)}>
                      <option value="1">1 - Sınırlı</option>
                      <option value="2">2 - Orta</option>
                      <option value="3">3 - Ciddi</option>
                      <option value="4">4 - Kritik</option>
                      <option value="5">5 - Felaket</option>
                    </select>
                  </td>
                  <td>
                    <strong>{asset.score} ({asset.score >= 12 ? 'Yüksek' : asset.score >= 6 ? 'Orta' : 'Düşük'})</strong>
                  </td>
                  <td className="actions-cell">
                    <button className="action-btn btn-edit" title="Düzenle"><Icons.Edit size={14}/></button>
                    <button className="action-btn btn-delete" title="Sil"><Icons.Trash size={14}/></button>
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
