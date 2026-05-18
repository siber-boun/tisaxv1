import React from 'react';
import RadarChart from './RadarChart';
import './MainDashboardPage.css';

export default function MainDashboardPage({ onNavigate }) {
  // Örnek Radar Verisi (Son Testten çekilmiş gibi simüle edilmiştir)
  const radarMockScores = {
    governance: 3, asset_protection: 3, iam: 2, 
    third_party: 1, incident_response: 2, business_continuity: 3, awareness: 4
  };

  // Kartlara tıklandığında ilgili modüle yönlendirme
  const handleCardClick = (viewId) => {
    if (onNavigate) {
      onNavigate(viewId);
    }
  };

  return (
    <div className="md-container">
      <div className="md-header">
        <h2>Kurumsal Güvenlik Panosu</h2>
        <p>Tüm bilgi güvenliği modüllerinin genel durum özetini buradan takip edebilirsiniz.</p>
      </div>

      <div className="md-grid">
        
        {/* A. Siber Olgunluk Durum Kartı (Geniş Kart) */}
        <div className="md-card md-card-large" onClick={() => handleCardClick('raporlama')}>
          <div className="md-card-header">
            <h3>Mevcut Siber Olgunluk Analizi</h3>
            <span className="md-link-icon">Genişlet ↗</span>
          </div>
          <div className="md-card-content md-radar-preview">
            <div className="md-radar-wrapper">
              <RadarChart scores={radarMockScores} size={250} />
            </div>
            <div className="md-radar-summary">
              <div className="md-score-highlight">
                <strong>Genel Hazırlık: %68</strong>
                <span className="md-badge md-badge-warning">Orta Seviye</span>
              </div>
              <p>Son teste göre 'Tedarikçi Güvenliği' ve 'Olay Müdahale' alanlarında iyileştirmeye ihtiyaç var.</p>
            </div>
          </div>
        </div>

        {/* B. Varlık Yönetimi Özet Kartı */}
        <div className="md-card" onClick={() => handleCardClick('varlik')}>
          <div className="md-card-header">
            <h3>Kritik Varlık Envanteri</h3>
            <span className="md-link-icon">↗</span>
          </div>
          <div className="md-card-content">
            <div className="md-stat-big">4 <small>Aktif Varlık</small></div>
            <ul className="md-list-preview">
              <li>
                <span className="md-dot red"></span> Sunucu (Sistem Odası)
              </li>
              <li>
                <span className="md-dot red"></span> Laptop (Yönetim)
              </li>
              <li>
                <span className="md-dot yellow"></span> Ağ Cihazları (Kat 1)
              </li>
            </ul>
          </div>
        </div>

        {/* C. Risk Yönetimi Özet Kartı */}
        <div className="md-card" onClick={() => handleCardClick('risk')}>
          <div className="md-card-header">
            <h3>Aktif Risk Dağılımı</h3>
            <span className="md-link-icon">↗</span>
          </div>
          <div className="md-card-content md-risk-content">
             <div className="md-risk-row">
               <span className="md-risk-label">Kritik / Yüksek</span>
               <span className="md-badge md-badge-danger">2</span>
             </div>
             <div className="md-risk-row">
               <span className="md-risk-label">Orta</span>
               <span className="md-badge md-badge-warning">1</span>
             </div>
             <div className="md-risk-row">
               <span className="md-risk-label">Düşük</span>
               <span className="md-badge md-badge-success">1</span>
             </div>
             <p className="md-micro-text">Riski 15 ve üzeri olan 2 varlık acil aksiyon bekliyor.</p>
          </div>
        </div>

        {/* D. Denetim ve Kullanıcı Takip Kartı */}
        <div className="md-card" onClick={() => handleCardClick('kullanici-yonetimi')}>
          <div className="md-card-header">
            <h3>Denetçi Görevleri</h3>
            <span className="md-link-icon">↗</span>
          </div>
          <div className="md-card-content">
            <div className="md-progress-item">
              <div className="md-progress-info">
                <span>Ahmet Y. (TISAX)</span>
                <strong>%65</strong>
              </div>
              <div className="md-progress-bar"><div className="md-progress-fill" style={{width: '65%'}}></div></div>
            </div>
            <div className="md-progress-item">
              <div className="md-progress-info">
                <span>Elif K. (ISO 21434)</span>
                <strong>%20</strong>
              </div>
              <div className="md-progress-bar"><div className="md-progress-fill" style={{width: '20%'}}></div></div>
            </div>
          </div>
        </div>

        {/* E. Tehdit Modellemesi (STRIDE) Kartı */}
        <div className="md-card" onClick={() => handleCardClick('tehdit')}>
          <div className="md-card-header">
            <h3>STRIDE Tehdit Analizi</h3>
            <span className="md-link-icon">↗</span>
          </div>
          <div className="md-card-content md-threat-content">
            <div className="md-threat-stat">
              <div className="md-threat-box open">
                <strong>4</strong>
                <span>Açık Risk</span>
              </div>
              <div className="md-threat-box resolved">
                <strong>2</strong>
                <span>Giderildi</span>
              </div>
            </div>
            <p className="md-micro-text">Sistemde toplam 6 tehdit tanımlandı. Kimlik sahtekarlığı (S) en sık görülen vektör.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
