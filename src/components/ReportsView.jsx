import React from "react";
import RadarChart from "./RadarChart";
import "./ReportsView.css";

const MOCK_REPORTS = [
  {
    id: 3,
    date: "18.05.2026 14:30",
    scores: {
      governance: 4,
      asset_protection: 3,
      iam: 4,
      third_party: 2,
      incident_response: 4,
      business_continuity: 3,
      awareness: 4,
    },
  },
  {
    id: 2,
    date: "16.05.2026 10:15",
    scores: {
      governance: 3,
      asset_protection: 2,
      iam: 2,
      third_party: 1,
      incident_response: 3,
      business_continuity: 2,
      awareness: 3,
    },
  },
  {
    id: 1,
    date: "14.05.2026 09:00",
    scores: {
      governance: 1,
      asset_protection: 2,
      iam: 1,
      third_party: 0,
      incident_response: 2,
      business_continuity: 1,
      awareness: 2,
    },
  },
];

export default function ReportsView() {
  return (
    <div className="reports-view-container">
      <div className="view-header">
        <h2 className="view-title">Raporlama ve Analiz</h2>
        <p>Kurumunuzun siber olgunluk gelişimini tarihsel olarak takip edin.</p>
      </div>

      <div className="reports-grid">
        {MOCK_REPORTS.map((report) => (
          <div key={report.id} className="report-card">
            <div className="chart-wrapper">
              <RadarChart scores={report.scores} size={300} />
            </div>
            <div className="report-footer">
              <div className="report-date-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>Hesaplama Zamanı: {report.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Yapay Zeka Uyum Analizi */}
      <section className="ai-analysis-section">
        <div className="section-header-ai">
          <div className="ai-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
          </div>
          <h3>Yapay Zeka Uyum Analizi</h3>
        </div>

        <div className="ai-recommendations-grid">
          <div className="ai-column must">
            <h4>
              <span className="status-dot red"></span>
              Zorunlu Öneriler (Must)
            </h4>
            <div className="ai-card">
              <div className="ai-card-title">Kritik Varlık Şifreleme Eksikliği</div>
              <p>Varlık Yönetimi verilerine göre, hassas veri sınıfındaki 3 sunucuda AES-256 şifreleme aktif değildir. TISAX VDA ISA 5.2.2 maddesi uyarınca zorunludur.</p>
            </div>
            <div className="ai-card">
              <div className="ai-card-title">IAM - MFA Eksikliği</div>
              <p>Yetkili (Privileged) hesapların %40'ında MFA pasif durumdadır. Acilen tüm yönetici hesapları için MFA zorunlu hale getirilmelidir.</p>
            </div>
          </div>

          <div className="ai-column should">
            <h4>
              <span className="status-dot blue"></span>
              Tavsiye Öneriler (Should)
            </h4>
            <div className="ai-card">
              <div className="ai-card-title">Farkındalık Eğitimi Sıklığı</div>
              <p>Güvenlik farkındalığı eğitimlerinin 6 ayda bir yapılması önerilir. Mevcut periyot (12 ay) sektör ortalamasının gerisindedir.</p>
            </div>
            <div className="ai-card">
              <div className="ai-card-title">Olay Müdahale Test Senaryoları</div>
              <p>ISO 21434 uyumu için 'Supply Chain Attack' senaryosunun yıllık tatbikata dahil edilmesi olgunluk puanınızı +15 artıracaktır.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

