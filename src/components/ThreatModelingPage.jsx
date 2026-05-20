import React, { useState, useEffect } from 'react';
import './ThreatModelingPage.css';
import { Icons } from './Icons';

const STRIDE_TEMPLATES = [
  { type: 'Spoofing', desc: '', impact: 'Düşük' },
  { type: 'Tampering', desc: '', impact: 'Düşük' },
  { type: 'Repudiation', desc: '', impact: 'Düşük' },
  { type: 'Information Disclosure', desc: '', impact: 'Düşük' },
  { type: 'Denial of Service', desc: '', impact: 'Düşük' },
  { type: 'Elevation of Privilege', desc: '', impact: 'Düşük' }
];

export default function ThreatModelingPage({ assets = [], threats = {}, setThreats }) {
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id || '');
  const [localThreats, setLocalThreats] = useState([]);

  // Varlık değiştiğinde veya global threats güncellendiğinde yerel tabloyu doldur
  useEffect(() => {
    if (!selectedAssetId) return;

    // Eğer bu varlık için daha önce veri girilmemişse şablonu kullan
    const existing = threats[selectedAssetId];
    if (existing && existing.length === 6) {
      setLocalThreats(existing);
    } else {
      setLocalThreats(STRIDE_TEMPLATES.map(t => ({ ...t })));
    }
  }, [selectedAssetId, threats]);

  const handleRowChange = (index, field, value) => {
    const updated = [...localThreats];
    updated[index][field] = value;
    setLocalThreats(updated);

    // Global state'e kaydet
    setThreats({
      ...threats,
      [selectedAssetId]: updated
    });
  };

  const getThreatRowClass = (impact) => {
    if (impact === 'Yüksek') return 'row-threat-high';
    if (impact === 'Orta') return 'row-threat-med';
    return 'row-threat-low';
  };

  return (
    <div className="tm-container">
      <div className="tm-header">
        <h2>STRIDE Tehdit Modellemesi</h2>
        <p>Seçili varlık için 6 temel STRIDE kategorisinde tehdit analizi yapın.</p>
      </div>

      {/* Varlık Seçim Alanı */}
      <div className="tm-asset-selector-card">
        <label>Analiz Edilecek Varlık:</label>
        <select 
          value={selectedAssetId} 
          onChange={(e) => setSelectedAssetId(e.target.value)} 
          className="tm-main-select"
        >
          {assets.map(asset => (
            <option key={asset.id} value={asset.id}>
              {asset.name} ({asset.location}) - ID: {asset.id}
            </option>
          ))}
        </select>
      </div>

      {/* STRIDE Tablosu (Eski Tasarımın Gelişmiş Hali) */}
      <div className="tm-card">
        <div className="tm-table-header-info">
          <h3>Varlık: {assets.find(a => a.id === selectedAssetId)?.name || 'Seçilmedi'}</h3>
          <span className="stride-badge">STRIDE Metodolojisi</span>
        </div>
        
        <table className="tm-table">
          <thead>
            <tr>
              <th style={{width: '20%'}}>Tehdit Kategorisi</th>
              <th style={{width: '55%'}}>Tehdit Senaryosu / Açıklama</th>
              <th style={{width: '15%'}}>Etki</th>
              <th style={{width: '10%', textAlign: 'center'}}>Durum</th>
            </tr>
          </thead>
          <tbody>
            {localThreats.map((row, index) => (
              <tr key={row.type} className={getThreatRowClass(row.impact)}>
                <td>
                  <strong>{row.type}</strong>
                </td>
                <td>
                  <textarea 
                    className="tm-inline-textarea"
                    value={row.desc}
                    onChange={(e) => handleRowChange(index, 'desc', e.target.value)}
                    placeholder={`${row.type} için potansiyel risk senaryosunu giriniz...`}
                  />
                </td>
                <td>
                  <select 
                    className="tm-inline-select"
                    value={row.impact}
                    onChange={(e) => handleRowChange(index, 'impact', e.target.value)}
                  >
                    <option value="Yüksek">Yüksek</option>
                    <option value="Orta">Orta</option>
                    <option value="Düşük">Düşük</option>
                  </select>
                </td>
                <td style={{textAlign: 'center'}}>
                  {row.desc ? <Icons.Shield size={18} style={{color: 'var(--accent-green)'}} /> : <Icons.Alert size={18} style={{color: 'var(--text-muted)'}} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
