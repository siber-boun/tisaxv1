import React, { useState } from 'react';
import './AssetManagementPage.css';

// Varsayılan Mock Veriler (CIA eklendi)
const INITIAL_ASSETS = [
  { id: "V-1001", name: "Sunucu", type: "Sunucu / Donanım", location: "Veri Merkezi - Sistem Odası", owner: "Bilgi İşlem", status: "Aktif", cia: { c: 3, i: 3, a: 3 } },
  { id: "V-1002", name: "Kullanıcı Bilgisayarı", type: "İş İstasyonu", location: "Mühendislik Departmanı", owner: "Melih Kaan", status: "Aktif", cia: { c: 2, i: 2, a: 2 } },
  { id: "V-1003", name: "Laptop", type: "Taşınabilir Cihaz", location: "Yönetim Ofisi", owner: "Banu Sencer", status: "Aktif", cia: { c: 3, i: 2, a: 2 } },
  { id: "V-1004", name: "Switch ve Ağ Cihazları", type: "Ağ Altyapısı", location: "Omurga Kabini - Kat 1", owner: "Ağ Yönetimi", status: "Aktif", cia: { c: 1, i: 2, a: 3 } }
];

const CIA_OPTIONS = [
  { value: 1, label: "Düşük (1)" },
  { value: 2, label: "Orta (2)" },
  { value: 3, label: "Yüksek (3)" }
];

export default function AssetManagementPage() {
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: '', type: 'Sunucu / Donanım', location: '', owner: '',
    cia: { c: 2, i: 2, a: 2 }
  });

  const handleAddAsset = (e) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.location || !newAsset.owner) return;
    
    const assetObj = {
      id: `V-${1000 + assets.length + 1}`,
      name: newAsset.name,
      type: newAsset.type,
      location: newAsset.location,
      owner: newAsset.owner,
      status: "Aktif",
      cia: { ...newAsset.cia }
    };

    setAssets([...assets, assetObj]);
    setNewAsset({ name: '', type: 'Sunucu / Donanım', location: '', owner: '', cia: { c: 2, i: 2, a: 2 } });
    setIsFormOpen(false);
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

  return (
    <div className="am-container">
      <div className="am-header-section">
        <div className="am-header-text">
          <h2>Varlık Yönetimi</h2>
          <p>Kurumunuza ait kritik bilgi varlıklarını, lokasyonlarını, sahiplerini ve CIA değerlerini merkezi olarak yönetin.</p>
        </div>
        <button className="am-btn-primary am-add-btn" onClick={() => setIsFormOpen(!isFormOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {isFormOpen ? "Formu Kapat" : "Yeni Varlık Ekle"}
        </button>
      </div>

      {isFormOpen && (
        <div className="am-form-panel">
          <div className="am-panel-header">
            <h3>Varlık Kayıt Formu</h3>
          </div>
          <form className="am-form" onSubmit={handleAddAsset}>
            <div className="am-form-row">
              <div className="am-field">
                <label>Varlık Adı</label>
                <input type="text" placeholder="Örn: Uygulama Sunucusu" value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} required />
              </div>
              <div className="am-field">
                <label>Varlık Tipi</label>
                <select value={newAsset.type} onChange={e => setNewAsset({...newAsset, type: e.target.value})}>
                  <option value="Sunucu / Donanım">Sunucu / Donanım</option>
                  <option value="İş İstasyonu">İş İstasyonu</option>
                  <option value="Taşınabilir Cihaz">Taşınabilir Cihaz</option>
                  <option value="Ağ Altyapısı">Ağ Altyapısı</option>
                  <option value="Yazılım / Uygulama">Yazılım / Uygulama</option>
                  <option value="Veri Tabanı">Veri Tabanı</option>
                </select>
              </div>
            </div>
            <div className="am-form-row">
              <div className="am-field">
                <label>Varlık Lokasyonu</label>
                <input type="text" placeholder="Örn: Kat 3 - Ar-Ge Odası" value={newAsset.location} onChange={e => setNewAsset({...newAsset, location: e.target.value})} required />
              </div>
              <div className="am-field">
                <label>Varlık Sahibi Bilgisi</label>
                <input type="text" placeholder="Örn: IT Departmanı" value={newAsset.owner} onChange={e => setNewAsset({...newAsset, owner: e.target.value})} required />
              </div>
            </div>

            {/* CIA Alanları */}
            <div className="am-panel-subheader">
              <h4>CIA Değerlendirmesi (Gizlilik, Bütünlük, Erişilebilirlik)</h4>
            </div>
            <div className="am-form-row cia-row">
              <div className="am-field">
                <label>Gizlilik (Confidentiality)</label>
                <select value={newAsset.cia.c} onChange={e => setNewAsset({...newAsset, cia: {...newAsset.cia, c: Number(e.target.value)}})}>
                  {CIA_OPTIONS.map(opt => <option key={`c-${opt.value}`} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="am-field">
                <label>Bütünlük (Integrity)</label>
                <select value={newAsset.cia.i} onChange={e => setNewAsset({...newAsset, cia: {...newAsset.cia, i: Number(e.target.value)}})}>
                  {CIA_OPTIONS.map(opt => <option key={`i-${opt.value}`} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="am-field">
                <label>Erişilebilirlik (Availability)</label>
                <select value={newAsset.cia.a} onChange={e => setNewAsset({...newAsset, cia: {...newAsset.cia, a: Number(e.target.value)}})}>
                  {CIA_OPTIONS.map(opt => <option key={`a-${opt.value}`} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>

            <div className="am-form-actions">
              <button type="submit" className="am-btn-primary">Varlığı Kaydet</button>
            </div>
          </form>
        </div>
      )}

      <div className="am-table-card">
        <div className="am-table-wrapper">
          <table className="am-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Varlık Adı</th>
                <th>Tipi & Lokasyon</th>
                <th>Sahibi</th>
                <th>CIA Değerlendirmesi</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, index) => (
                <tr key={index}>
                  <td className="am-id-cell">{asset.id}</td>
                  <td><strong>{asset.name}</strong></td>
                  <td>
                    <div className="am-cell-stack">
                      <span>{asset.type}</span>
                      <small>{asset.location}</small>
                    </div>
                  </td>
                  <td>{asset.owner}</td>
                  <td>
                    <div className="cia-badges">
                      <span className={`cia-badge ${getCiaClass(asset.cia.c)}`} title="Gizlilik (Confidentiality)">
                        <strong>C:</strong> {getCiaLabel(asset.cia.c)}
                      </span>
                      <span className={`cia-badge ${getCiaClass(asset.cia.i)}`} title="Bütünlük (Integrity)">
                        <strong>I:</strong> {getCiaLabel(asset.cia.i)}
                      </span>
                      <span className={`cia-badge ${getCiaClass(asset.cia.a)}`} title="Erişilebilirlik (Availability)">
                        <strong>A:</strong> {getCiaLabel(asset.cia.a)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="am-status-badge">
                      <span className="am-status-dot"></span>
                      {asset.status}
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
