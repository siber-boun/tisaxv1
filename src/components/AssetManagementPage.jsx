import React, { useState } from 'react';
import './AssetManagementPage.css';

// Varsayılan Mock Veriler
const INITIAL_ASSETS = [
  { id: "V-1001", name: "Sunucu", type: "Sunucu / Donanım", location: "Veri Merkezi - Sistem Odası", owner: "Bilgi İşlem", status: "Aktif" },
  { id: "V-1002", name: "Kullanıcı Bilgisayarı", type: "İş İstasyonu", location: "Mühendislik Departmanı", owner: "Melih Kaan", status: "Aktif" },
  { id: "V-1003", name: "Laptop", type: "Taşınabilir Cihaz", location: "Yönetim Ofisi", owner: "Banu Sencer", status: "Aktif" },
  { id: "V-1004", name: "Switch ve Ağ Cihazları", type: "Ağ Altyapısı", location: "Omurga Kabini - Kat 1", owner: "Ağ Yönetimi", status: "Aktif" }
];

export default function AssetManagementPage() {
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: '', type: 'Sunucu / Donanım', location: '', owner: ''
  });

  const handleAddAsset = (e) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.location || !newAsset.owner) return;
    
    // Yeni varlık objesi oluştur
    const assetObj = {
      id: `V-${1000 + assets.length + 1}`,
      name: newAsset.name,
      type: newAsset.type,
      location: newAsset.location,
      owner: newAsset.owner,
      status: "Aktif"
    };

    setAssets([...assets, assetObj]);
    
    // Formu temizle ve kapat
    setNewAsset({ name: '', type: 'Sunucu / Donanım', location: '', owner: '' });
    setIsFormOpen(false);
  };

  return (
    <div className="am-container">
      <div className="am-header-section">
        <div className="am-header-text">
          <h2>Varlık Yönetimi</h2>
          <p>Kurumunuza ait kritik bilgi varlıklarını, lokasyonlarını ve sahiplerini merkezi olarak yönetin.</p>
        </div>
        <button className="am-btn-primary am-add-btn" onClick={() => setIsFormOpen(!isFormOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {isFormOpen ? "Formu Kapat" : "Yeni Varlık Ekle"}
        </button>
      </div>

      {/* Varlık Ekleme Form Paneli (Koşullu Render) */}
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
            <div className="am-form-actions">
              <button type="submit" className="am-btn-primary">Varlığı Kaydet</button>
            </div>
          </form>
        </div>
      )}

      {/* Varlık Listeleme Tablosu */}
      <div className="am-table-card">
        <div className="am-table-wrapper">
          <table className="am-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Varlık Adı</th>
                <th>Varlık Tipi</th>
                <th>Lokasyon</th>
                <th>Varlık Sahibi</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, index) => (
                <tr key={index}>
                  <td className="am-id-cell">{asset.id}</td>
                  <td><strong>{asset.name}</strong></td>
                  <td>{asset.type}</td>
                  <td>{asset.location}</td>
                  <td>{asset.owner}</td>
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
