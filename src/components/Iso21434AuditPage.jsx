import React, { useState } from 'react';
import './Iso21434AuditPage.css';

const CSMS_CONTROLS = [
  { id: '5.1', item: 'Siber Güvenlik Politikası ve Sorumluluklar', desc: 'Kurumsal düzeyde politikaların tanımlanması.' },
  { id: '5.2', item: 'Siber Güvenlik Yönetim Sistemi (CSMS)', desc: 'Sürekli yönetim süreçlerinin işletilmesi.' },
  { id: '6.1', item: 'Proje Bazlı Siber Güvenlik Planı', desc: 'Her araç projesi için özel planlama.' },
  { id: '6.2', item: 'Bağımsız Denetçi Ataması', desc: 'Güvenlik değerlendirmesi için bağımsız onay.' }
];

const LIFECYCLE_STEPS = [
  { id: 1, label: 'Konsept', status: 'Tamamlandı', desc: 'Güvenlik hedefleri belirlendi.' },
  { id: 2, label: 'Ürün Geliştirme', status: 'Devam Ediyor', desc: 'Yazılım ve donanım testleri.' },
  { id: 3, label: 'Üretim', status: 'Beklemede', desc: 'Güvenli üretim hattı kontrolü.' },
  { id: 4, label: 'İşletme / Bakım', status: 'Beklemede', desc: 'OTA güncellemeleri ve izleme.' },
  { id: 5, label: 'Hizmetten Çıkarma', status: 'Beklemede', desc: 'Veri imhası ve sistem kapatma.' }
];

export default function Iso21434AuditPage({ assets = [] }) {
  const [activeTab, setActiveTab] = useState('csms');
  const [calLevels, setCalLevels] = useState({});

  // CAL Seviyesi Değişimi
  const handleCalChange = (assetId, level) => {
    setCalLevels({ ...calLevels, [assetId]: level });
  };

  const getCalClass = (level) => {
    if (level === 'CAL 4') return 'cal-4';
    if (level === 'CAL 3') return 'cal-3';
    if (level === 'CAL 2') return 'cal-2';
    return 'cal-1';
  };

  return (
    <div className="iso-container">
      <div className="iso-header">
        <h2>ISO/SAE 21434 Denetim ve Uyum</h2>
        <p>Otomotiv siber güvenlik mühendisliği süreçlerinizi standart gereksinimlerine göre yönetin.</p>
      </div>

      {/* Üst Sekme Navigasyonu */}
      <div className="iso-tabs">
        <button className={activeTab === 'csms' ? 'active' : ''} onClick={() => setActiveTab('csms')}>CSMS Organizasyonel Uyum</button>
        <button className={activeTab === 'tara' ? 'active' : ''} onClick={() => setActiveTab('tara')}>TARA & CAL Seviyeleri</button>
        <button className={activeTab === 'lifecycle' ? 'active' : ''} onClick={() => setActiveTab('lifecycle')}>Yaşam Döngüsü İzleme</button>
      </div>

      <div className="iso-content">
        
        {/* Sekme 1: CSMS Organizasyonel Uyum */}
        {activeTab === 'csms' && (
          <div className="iso-tab-panel">
            <div className="iso-card">
              <table className="iso-table">
                <thead>
                  <tr>
                    <th>Kontrol Maddesi</th>
                    <th>Açıklama</th>
                    <th>Uyum Durumu</th>
                    <th>Kanıt Dosyası</th>
                  </tr>
                </thead>
                <tbody>
                  {CSMS_CONTROLS.map((c) => (
                    <tr key={c.id}>
                      <td><strong>{c.id} - {c.item}</strong></td>
                      <td><small>{c.desc}</small></td>
                      <td>
                        <select className="iso-select">
                          <option>Uyumlu</option>
                          <option>Kısmen Uyumlu</option>
                          <option>Uyumsuz</option>
                        </select>
                      </td>
                      <td>
                        <button className="iso-btn-outline">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          Yükle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sekme 2: TARA & CAL Seviyeleri */}
        {activeTab === 'tara' && (
          <div className="iso-tab-panel">
            <div className="iso-card">
              <table className="iso-table">
                <thead>
                  <tr>
                    <th>Varlık Adı</th>
                    <th>Lokasyon</th>
                    <th>Hedef CAL Seviyesi</th>
                    <th>Risk Özeti</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.length === 0 ? (
                    <tr><td colSpan="4" style={{textAlign:'center', padding: '2rem'}}>Lütfen önce Varlık Yönetimi kısmından varlık ekleyin.</td></tr>
                  ) : (
                    assets.map((asset) => (
                      <tr key={asset.id}>
                        <td><strong>{asset.name}</strong></td>
                        <td>{asset.location}</td>
                        <td>
                          <div className="cal-selector-group">
                            <select 
                              className={`iso-select ${getCalClass(calLevels[asset.id] || 'CAL 1')}`}
                              value={calLevels[asset.id] || 'CAL 1'}
                              onChange={(e) => handleCalChange(asset.id, e.target.value)}
                            >
                              <option value="CAL 1">CAL 1 (Düşük)</option>
                              <option value="CAL 2">CAL 2 (Orta)</option>
                              <option value="CAL 3">CAL 3 (Yüksek)</option>
                              <option value="CAL 4">CAL 4 (Kritik)</option>
                            </select>
                            <span className={`cal-badge ${getCalClass(calLevels[asset.id] || 'CAL 1')}`}>
                              {calLevels[asset.id] || 'CAL 1'}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="iso-text-link">Analiz Görüntüle</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sekme 3: Yaşam Döngüsü (Lifecycle) İzleme */}
        {activeTab === 'lifecycle' && (
          <div className="iso-tab-panel">
            <div className="iso-card iso-stepper-card">
              <div className="iso-stepper">
                {LIFECYCLE_STEPS.map((step, index) => (
                  <div key={step.id} className={`step-item ${step.status === 'Tamamlandı' ? 'done' : step.status === 'Devam Ediyor' ? 'active' : ''}`}>
                    <div className="step-circle">{index + 1}</div>
                    <div className="step-content">
                      <h4>{step.label}</h4>
                      <p>{step.desc}</p>
                      <span className="step-status-tag">{step.status}</span>
                    </div>
                    {index < LIFECYCLE_STEPS.length - 1 && <div className="step-line"></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
