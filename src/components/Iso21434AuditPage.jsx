import React, { useState } from 'react';
import './Iso21434AuditPage.css';
import { Icons } from './Icons';

const CSMS_CONTROLS = [
  { id: '5.1', item: 'Siber Güvenlik Politikası ve Sorumluluklar', desc: 'Kurumsal düzeyde politikaların tanımlanması.', status: 'Done' },
  { id: '5.2', item: 'Siber Güvenlik Yönetim Sistemi (CSMS)', desc: 'Sürekli yönetim süreçlerinin işletilmesi.', status: 'Partial' },
  { id: '6.1', item: 'Proje Bazlı Siber Güvenlik Planı', desc: 'Her araç projesi için özel planlama.', status: 'None' },
  { id: '6.2', item: 'Bağımsız Denetçi Ataması', desc: 'Güvenlik değerlendirmesi için bağımsız onay.', status: 'None' }
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

      <div className="iso-tabs">
        <button className={activeTab === 'csms' ? 'active' : ''} onClick={() => setActiveTab('csms')}>CSMS Organizasyonel Uyum</button>
        <button className={activeTab === 'tara' ? 'active' : ''} onClick={() => setActiveTab('tara')}>TARA & CAL Seviyeleri</button>
        <button className={activeTab === 'lifecycle' ? 'active' : ''} onClick={() => setActiveTab('lifecycle')}>Yaşam Döngüsü İzleme</button>
      </div>

      <div className="iso-content">
        {activeTab === 'csms' && (
          <div className="iso-tab-panel">
            <div className="iso-card">
              <table className="iso-table">
                <thead>
                  <tr>
                    <th>Kontrol Maddesi</th>
                    <th>Açıklama</th>
                    <th>Uyum Durumu</th>
                    <th style={{textAlign: 'right'}}>Aksiyonlar</th>
                  </tr>
                </thead>
                <tbody>
                  {CSMS_CONTROLS.map((c) => {
                    const rowClass = c.status === 'Done' ? 'row-compliant' : 
                                     c.status === 'Partial' ? 'row-partial' : 'row-noncompliant';
                    return (
                      <tr key={c.id} className={rowClass}>
                        <td><strong>{c.id} - {c.item}</strong></td>
                        <td><small>{c.desc}</small></td>
                        <td>
                          <select className="iso-select" defaultValue={c.status === 'Done' ? 'Uyumlu' : c.status === 'Partial' ? 'Kısmen Uyumlu' : 'Uyumsuz'}>
                            <option>Uyumlu</option>
                            <option>Kısmen Uyumlu</option>
                            <option>Uyumsuz</option>
                          </select>
                        </td>
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
          </div>
        )}

        {activeTab === 'tara' && (
          <div className="iso-tab-panel">
            <div className="iso-card">
              <table className="iso-table">
                <thead>
                  <tr>
                    <th>Varlık Adı</th>
                    <th>Lokasyon</th>
                    <th>CAL Seviyesi</th>
                    <th style={{textAlign: 'right'}}>Aksiyonlar</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.length === 0 ? (
                    <tr><td colSpan="4" style={{textAlign:'center', padding: '2rem'}}>Varlık ekleyin.</td></tr>
                  ) : (
                    assets.map((asset) => (
                      <tr key={asset.id}>
                        <td><strong>{asset.name}</strong></td>
                        <td>{asset.location}</td>
                        <td>
                          <select 
                            className="iso-select"
                            value={calLevels[asset.id] || 'CAL 1'}
                            onChange={(e) => handleCalChange(asset.id, e.target.value)}
                          >
                            <option value="CAL 1">CAL 1</option>
                            <option value="CAL 2">CAL 2</option>
                            <option value="CAL 3">CAL 3</option>
                            <option value="CAL 4">CAL 4</option>
                          </select>
                        </td>
                        <td className="actions-cell">
                          <button className="action-btn btn-edit" title="Düzenle"><Icons.Edit size={14}/></button>
                          <button className="action-btn btn-delete" title="Sil"><Icons.Trash size={14}/></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
