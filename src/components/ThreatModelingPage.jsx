import React from 'react';
import './ThreatModelingPage.css';
import { Icons } from './Icons';

const STRIDE_THREATS = [
  { id: 'T-01', type: 'Spoofing', desc: 'Sistem yetkilisi taklit edilerek yetkisiz erişim.', impact: 'Yüksek' },
  { id: 'T-02', desc: 'Veri paketlerinin değiştirilmesi.', type: 'Tampering', impact: 'Orta' },
  { id: 'T-03', desc: 'İşlemin reddedilmesi.', type: 'Repudiation', impact: 'Düşük' },
  { id: 'T-04', desc: 'Hassas bilgilerin sızdırılması.', type: 'Info Disclosure', impact: 'Yüksek' },
  { id: 'T-05', desc: 'Servis dışı bırakma saldırısı.', type: 'Denial of Service', impact: 'Yüksek' },
  { id: 'T-06', desc: 'Yetki yükseltme.', type: 'Elevation of Privilege', impact: 'Yüksek' }
];

export default function ThreatModelingPage() {
  const getThreatRowClass = (impact) => {
    if (impact === 'Yüksek') return 'row-threat-high';
    if (impact === 'Orta') return 'row-threat-med';
    return 'row-threat-low';
  };

  return (
    <div className="tm-container">
      <div className="tm-header">
        <h2>STRIDE Tehdit Modellemesi</h2>
        <p>Sistem mimarinizdeki potansiyel güvenlik tehditlerini STRIDE metodolojisi ile analiz edin.</p>
      </div>

      <div className="tm-card">
        <table className="tm-table">
          <thead>
            <tr>
              <th>ID - Tehdit Tipi</th>
              <th>Açıklama</th>
              <th>Etki Seviyesi</th>
              <th style={{textAlign: 'right'}}>Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>
            {STRIDE_THREATS.map((t) => (
              <tr key={t.id} className={getThreatRowClass(t.impact)}>
                <td>
                  <strong>{t.id} - {t.type}</strong>
                </td>
                <td><small>{t.desc}</small></td>
                <td><strong>{t.impact}</strong></td>
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
  );
}
