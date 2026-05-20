import React, { useState } from 'react';
import './AssetManagementPage.css';
import { Icons } from './Icons';

const CIA_OPTIONS = [
  { value: 1, label: "Düşük (1)" },
  { value: 2, label: "Orta (2)" },
  { value: 3, label: "Yüksek (3)" }
];

export default function AssetManagementPage({ assets = [], setAssets }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: '', type: 'Donanım', location: '', owner: '',
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

    if (setAssets) {
      setAssets([...assets, assetObj]);
    }
    
    setNewAsset({ name: '', type: 'Donanım', location: '', owner: '', cia: { c: 2, i: 2, a: 2 } });
    setIsFormOpen(false);
  };

  const handleDelete = (id) => {
    if (setAssets) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  return (
    <div className="am-container">
      <div className="am-header-section">
        <div className="am-header-text">
          <h2>Varlık Yönetimi</h2>
          <p>Kurumunuza ait kritik bilgi varlıklarını, lokasyonlarını, sahiplerini ve CIA değerlerini merkezi olarak yönetin.</p>
        </div>
        <button className="primary-btn am-add-btn" onClick={() => setIsFormOpen(!isFormOpen)}>
          <Icons.Plus size={18} />
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
                  <option value="Donanım">Donanım / Sunucu</option>
                  <option value="Yazılım">Yazılım / Uygulama</option>
                  <option value="Veri">Veri Tabanı / Bilgi</option>
                  <option value="Servis">Ağ / Bulut Servisi</option>
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

            <div className="am-panel-subheader">
              <h4>CIA Değerlendirmesi</h4>
            </div>
            <div className="am-form-row cia-row">
              <div className="am-field">
                <label>Gizlilik (C)</label>
                <select value={newAsset.cia.c} onChange={e => setNewAsset({...newAsset, cia: {...newAsset.cia, c: Number(e.target.value)}})}>
                  {CIA_OPTIONS.map(opt => <option key={`c-${opt.value}`} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="am-field">
                <label>Bütünlük (I)</label>
                <select value={newAsset.cia.i} onChange={e => setNewAsset({...newAsset, cia: {...newAsset.cia, i: Number(e.target.value)}})}>
                  {CIA_OPTIONS.map(opt => <option key={`i-${opt.value}`} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="am-field">
                <label>Erişilebilirlik (A)</label>
                <select value={newAsset.cia.a} onChange={e => setNewAsset({...newAsset, cia: {...newAsset.cia, a: Number(e.target.value)}})}>
                  {CIA_OPTIONS.map(opt => <option key={`a-${opt.value}`} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>

            <div className="am-form-actions">
              <button type="submit" className="primary-btn">Varlığı Kaydet</button>
            </div>
          </form>
        </div>
      )}

      <div className="am-table-card">
        <div className="am-table-wrapper">
          <table className="am-table">
            <thead>
              <tr>
                <th>Varlık Kimliği</th>
                <th>Varlık Adı & Tip</th>
                <th>Sahibi & Lokasyon</th>
                <th>CIA Değerleri</th>
                <th style={{textAlign: 'right'}}>Aksiyonlar</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => {
                const rowClass = asset.type === 'Donanım' ? 'row-hardware' : 
                                 asset.type === 'Yazılım' ? 'row-software' : 
                                 asset.type === 'Veri' ? 'row-data' : 'row-service';
                return (
                  <tr key={asset.id} className={rowClass}>
                    <td className="am-id-cell">{asset.id}</td>
                    <td>
                      <div className="am-cell-stack">
                        <strong>{asset.name}</strong>
                        <small>{asset.type}</small>
                      </div>
                    </td>
                    <td>
                      <div className="am-cell-stack">
                        <strong>{asset.owner}</strong>
                        <small>{asset.location}</small>
                      </div>
                    </td>
                    <td>
                      <div className="cia-badges">
                        <span className={`cia-badge ${asset.cia.c >= 3 ? 'cia-high' : asset.cia.c >= 2 ? 'cia-medium' : 'cia-low'}`}>C:{asset.cia.c}</span>
                        <span className={`cia-badge ${asset.cia.i >= 3 ? 'cia-high' : asset.cia.i >= 2 ? 'cia-medium' : 'cia-low'}`}>I:{asset.cia.i}</span>
                        <span className={`cia-badge ${asset.cia.a >= 3 ? 'cia-high' : asset.cia.a >= 2 ? 'cia-medium' : 'cia-low'}`}>A:{asset.cia.a}</span>
                      </div>
                    </td>
                    <td className="actions-cell">
                      <button className="action-btn btn-edit" title="Düzenle">
                        <Icons.Edit size={16} />
                      </button>
                      <button className="action-btn btn-delete" title="Sil" onClick={() => handleDelete(asset.id)}>
                        <Icons.Trash size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
