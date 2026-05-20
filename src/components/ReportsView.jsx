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
  const [apiKey, setApiKey] = React.useState(() => localStorage.getItem("tisax_gemini_api_key") || "");
  const [selectedModel, setSelectedModel] = React.useState(() => localStorage.getItem("tisax_gemini_model") || "gemini-3.5-flash");
  const [isOpen, setIsOpen] = React.useState(false);
  const [showKey, setShowKey] = React.useState(false);
  const [testing, setTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState(null);

  const testConnection = async () => {
    if (!apiKey) return;
    setTesting(true);
    setTestResult(null);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Hello" }] }]
          })
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      setTestResult({ success: true, message: "Bağlantı başarılı! Yapay Zeka modeli aktif." });
    } catch (err) {
      setTestResult({ success: false, message: "Bağlantı başarısız. Lütfen API anahtarını kontrol edin." });
    } finally {
      setTesting(false);
    }
  };

  const saveSettings = () => {
    localStorage.setItem("tisax_gemini_api_key", apiKey);
    localStorage.setItem("tisax_gemini_model", selectedModel);
    setTestResult({ success: true, message: "Yapılandırma kaydedildi!" });
  };

  return (
    <div className="reports-view-container">
      <div className="view-header">
        <h2 className="view-title">Raporlama ve Analiz</h2>
        <p>Kurumunuzun siber olgunluk gelişimini tarihsel olarak takip edin.</p>
      </div>

      {/* AI API Control Panel */}
      <div className="ai-api-panel">
        <div className="ai-api-header">
          <div className="ai-api-title-group">
            <div className="ai-api-icon-glow">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sparkle-icon">
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            </div>
            <div>
              <h3>Yapay Zeka API Durumu</h3>
              <p className="ai-api-subtitle">Otomatik uyumluluk önerileri için Gemini entegrasyonu</p>
            </div>
          </div>
          <div className="ai-api-status-wrapper">
            <span className={`status-badge ${apiKey ? 'active' : 'inactive'}`}>
              <span className="pulse-dot"></span>
              {apiKey ? 'Aktif' : 'Kurulum Gerekli'}
            </span>
            <button className="settings-toggle-btn" onClick={() => setIsOpen(!isOpen)} title="Yapılandır">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isOpen ? 'rotate-180' : ''}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="ai-api-content">
            <div className="ai-api-grid">
              <div className="ai-api-input-group">
                <label htmlFor="api-key-input">Gemini API Anahtarı (API Key)</label>
                <div className="input-with-button">
                  <input
                    id="api-key-input"
                    type={showKey ? 'text' : 'password'}
                    placeholder="AIzaSy..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <button type="button" className="icon-btn-toggle" onClick={() => setShowKey(!showKey)}>
                    {showKey ? 'Gizle' : 'Göster'}
                  </button>
                </div>
              </div>

              <div className="ai-api-model-group">
                <label htmlFor="model-select">Yapay Zeka Modeli</label>
                <select
                  id="model-select"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  <option value="gemini-3.5-flash">Gemini 3.5 Flash (Önerilen)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                </select>
              </div>
            </div>

            <div className="ai-api-actions">
              <button 
                className="secondary-btn" 
                onClick={testConnection} 
                disabled={!apiKey || testing}
              >
                {testing ? 'Test Ediliyor...' : 'Bağlantıyı Test Et'}
              </button>
              <button className="primary-btn-save" onClick={saveSettings}>
                Yapılandırmayı Kaydet
              </button>
            </div>

            {testResult && (
              <div className={`test-feedback ${testResult.success ? 'success' : 'error'}`}>
                <span className="feedback-icon">{testResult.success ? '✓' : '✗'}</span>
                <span>{testResult.message}</span>
              </div>
            )}
          </div>
        )}
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
          <div className="ai-title-badge-wrap">
            <h3>Yapay Zeka Uyum Analizi</h3>
            <span className={`ai-mode-badge ${apiKey ? 'active' : 'demo'}`}>
              {apiKey ? 'Canlı API Aktif' : 'Demo Modu'}
            </span>
          </div>
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

