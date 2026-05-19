import React, { useState } from 'react';
import './ThreatModelingPage.css';

const STRIDE_CATEGORIES = [
  { id: 'S', title: 'Kimlik Sahtekarlığı (Spoofing)', desc: 'Bir kullanıcının veya sistemin kimliğinin taklit edilmesi.' },
  { id: 'T', title: 'Veri Kurcalama (Tampering)', desc: 'Sistemdeki, ağdaki veya veritabanındaki verilerin izinsiz değiştirilmesi.' },
  { id: 'R', title: 'İnkar Edilebilirlik (Repudiation)', desc: 'Bir eylemi gerçekleştiren kullanıcının, bu eylemi inkar edebilmesi (Log eksikliği).' },
  { id: 'I', title: 'Bilgi İfşası (Information Disclosure)', desc: 'Hassas verilerin yetkisiz kişilerin veya sistemlerin eline geçmesi.' },
  { id: 'D', title: 'Hizmet Aksatması (Denial of Service)', desc: 'Sistemin yasal kullanıcılara hizmet veremez hale getirilmesi.' },
  { id: 'E', title: 'Yetki Yükseltme (Elevation of Privilege)', desc: 'Yetkisiz bir kullanıcının, sistemde yönetici veya üst düzey haklar elde etmesi.' }
];

// Fallback assets (Eğer App.jsx'ten prop gelmezse diye)
const MOCK_ASSETS = [
  { id: "V-1001", name: "Sunucu", location: "Veri Merkezi" },
  { id: "V-1002", name: "Kullanıcı Bilgisayarı", location: "Mühendislik Departmanı" }
];

export default function ThreatModelingPage({ assets = MOCK_ASSETS, threats = [], setThreats }) {
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [inputs, setInputs] = useState({ S: '', T: '', R: '', I: '', D: '', E: '' });

  // İlgili kategoriye yeni tehdit ekleme
  const handleAddThreat = (categoryId) => {
    const text = inputs[categoryId]?.trim();
    if (!text || !selectedAssetId) return;

    const newThreat = {
      id: Date.now().toString(),
      assetId: selectedAssetId,
      category: categoryId,
      text: text,
      status: 'open' // 'open' (Açık Risk) veya 'resolved' (Giderildi)
    };

    setThreats([...threats, newThreat]);
    setInputs({ ...inputs, [categoryId]: '' });
  };

  // Tehdit durumunu değiştirme
  const toggleThreatStatus = (threatId) => {
    setThreats(threats.map(t => 
      t.id === threatId 
        ? { ...t, status: t.status === 'open' ? 'resolved' : 'open' } 
        : t
    ));
  };

  // Tehdidi silme
  const deleteThreat = (threatId) => {
    setThreats(threats.filter(t => t.id !== threatId));
  };

  const selectedAsset = assets.find(a => a.id === selectedAssetId);
  const assetThreats = threats.filter(t => t.assetId === selectedAssetId);

  return (
    <div className="tm-container">
      <div className="tm-header">
        <h2>Tehdit Modellemesi (STRIDE)</h2>
        <p>Bilgi varlıklarınıza yönelik olası tehdit vektörlerini endüstri standardı STRIDE metodolojisiyle analiz edin.</p>
      </div>

      {/* Bölüm 1: Varlık Seçici */}
      <div className="tm-asset-selector">
        <label>Modellenecek Varlığı Seçin:</label>
        <select 
          value={selectedAssetId} 
          onChange={(e) => setSelectedAssetId(e.target.value)}
          className="tm-select"
        >
          <option value="">-- Listeden Bir Varlık Seçin --</option>
          {assets.map(asset => (
            <option key={asset.id} value={asset.id}>
              {asset.id} - {asset.name} ({asset.location})
            </option>
          ))}
        </select>
      </div>

      {/* Bölüm 2: STRIDE Modelleme Paneli */}
      {selectedAsset && (
        <div className="tm-stride-panel">
          <div className="tm-panel-title">
            <h3><strong>{selectedAsset.name}</strong> için Tehdit Vektörleri</h3>
          </div>

          <div className="tm-stride-grid">
            {STRIDE_CATEGORIES.map((cat) => {
              const categoryThreats = assetThreats.filter(t => t.category === cat.id);

              return (
                <div key={cat.id} className="tm-stride-card">
                  <div className="tm-stride-card-header">
                    <div className="tm-stride-badge">{cat.id}</div>
                    <div className="tm-stride-title-group">
                      <h4>{cat.title}</h4>
                      <small>{cat.desc}</small>
                    </div>
                  </div>

                  {/* Tehdit Giriş Formu */}
                  <div className="tm-threat-input-group">
                    <input 
                      type="text" 
                      placeholder="Yeni tehdit senaryosu girin..." 
                      value={inputs[cat.id]}
                      onChange={(e) => setInputs({...inputs, [cat.id]: e.target.value})}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddThreat(cat.id)}
                    />
                    <button onClick={() => handleAddThreat(cat.id)}>Ekle</button>
                  </div>

                  {/* Tehdit Listesi */}
                  <div className="tm-threat-list">
                    {categoryThreats.length === 0 ? (
                      <p className="tm-empty-text">Bu kategoride henüz bir tehdit tanımlanmadı.</p>
                    ) : (
                      categoryThreats.map(threat => (
                        <div key={threat.id} className={`tm-threat-item ${threat.status}`}>
                          <div className="tm-threat-text">{threat.text}</div>
                          <div className="tm-threat-actions">
                            <button 
                              className={`tm-status-btn ${threat.status}`}
                              onClick={() => toggleThreatStatus(threat.id)}
                            >
                              {threat.status === 'open' ? 'Açık Risk' : 'Giderildi'}
                            </button>
                            <button 
                              className="tm-delete-btn"
                              onClick={() => deleteThreat(threat.id)}
                              title="Sil"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
