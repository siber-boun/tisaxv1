import React, { useState } from 'react';
import RadarChart from './RadarChart';

function scoreClass(score) {
  if (score >= 75) return "score-good";
  if (score >= 45) return "score-mid";
  return "score-low";
}

function parseAiOneri(text) {
  if (!text) return { intro: "", zorunlu: [], tavsiye: [], outro: "" };
  
  const lines = text.split('\n');
  let currentCategory = 'intro';
  const introLines = [];
  const zorunlu = [];
  const tavsiye = [];
  const outroLines = [];

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Detect header changes
    const lower = trimmed.toLowerCase();
    if (lower.includes('zorunlu') || lower.includes('yapılmalı') || lower.includes('must') || lower.includes('kategori 1')) {
      currentCategory = 'zorunlu';
      continue;
    }
    if (lower.includes('tavsiye') || lower.includes('yapılabilir') || lower.includes('should') || lower.includes('kategori 2')) {
      currentCategory = 'tavsiye';
      continue;
    }
    if ((lower.includes('sonuç') || lower.includes('özetle') || lower.includes('değerlendirme') || lower.includes('genel olarak')) && 
        (currentCategory === 'zorunlu' || currentCategory === 'tavsiye')) {
      currentCategory = 'outro';
    }

    if (currentCategory === 'intro') {
      introLines.push(line);
    } else if (currentCategory === 'zorunlu') {
      zorunlu.push(line);
    } else if (currentCategory === 'tavsiye') {
      tavsiye.push(line);
    } else {
      outroLines.push(line);
    }
  }

  return {
    intro: introLines.join('\n'),
    zorunlu: zorunlu.filter(l => l.trim().length > 2),
    tavsiye: tavsiye.filter(l => l.trim().length > 2),
    outro: outroLines.join('\n')
  };
}

export default function ScoreDashboard({ results, executiveSummary, text, profile }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("tisax_gemini_api_key") || "");
  const [aiOneri, setAiOneri] = useState(() => localStorage.getItem("tisax_ai_oneri") || "");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const handleGenerateAiRecommendations = async () => {
    if (!apiKey) return;
    setAiLoading(true);
    setAiError("");

    const sirketBuyuklugu = profile?.companySize || "Belirtilmedi";
    const sektor = profile?.industrySector || "Belirtilmedi";
    const tisaxDuzeyi = profile?.tisaxLevel || "Bilinmiyor";
    const riskIstahi = profile?.riskAppetite || "Orta";

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Sen bir siber güvenlik ve otomotiv uyumluluk uzmanısın. 
                Lütfen şu değerlendirilen kurum profili bilgilerini kullanarak detaylı ve özelleştirilmiş TISAX ve ISO/SAE 21434 uyumluluk önerileri üret:
                - Kurum / Şirket Adı: ${profile?.companyName || "Belirtilmedi"}
                - Sektör: ${sektor}
                - Şirket Ölçeği: ${sirketBuyuklugu}
                - Çalışan Sayısı: ${profile?.numberOfEmployees || "Belirtilmedi"}
                - Ofis Sayısı: ${profile?.officeLocations || "Belirtilmedi"}
                - Ülke / Konum: ${profile?.countryRegion || "Belirtilmedi"}
                - Mevcut / Hedeflenen TISAX Seviyesi: ${tisaxDuzeyi}
                - Risk İştahı: ${riskIstahi}
                
                Önerilerinde mutlaka bu kurum profili bilgilerine değin ve şirketin çalışan sayısına, sektörüne ve hedeflerine özel yorumlarda bulun.
                Önerileri iki ana kategoriye ayır: "Zorunlu Öneriler (Yapılmalı)" ve "Tavsiye Edilen Öneriler (Yapılabilir)".`
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP Hata: ${response.status}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
        const oneri = data.candidates[0].content.parts[0].text;
        setAiOneri(oneri);
        localStorage.setItem("tisax_ai_oneri", oneri);
      } else {
        throw new Error("API'den geçersiz yanıt formatı alındı.");
      }
    } catch (err) {
      console.error(err);
      setAiError(err.message || "İstek gönderilirken bir hata oluştu.");
    } finally {
      setAiLoading(false);
    }
  };

  // Map scores for radar chart (convert % to 0-4 range)
  const chartScores = results.sectionScores.reduce((acc, section) => {
    acc[section.id] = (section.score / 100) * 4;
    return acc;
  }, {});

  return (
    <div className="results-layout">
      {/* Kurum Profili Özet Kartı */}
      <section className="card results-main profile-summary-card" style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '0px',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 4px 20px rgba(0, 0, 0, 0.2)',
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff', fontWeight: 600 }}>Kurum Profili & Değerlendirme Kapsamı</h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Değerlendirilen kuruluşa ait kurumsal parametreler</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          <div className="profile-stat-item">
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kurum Adı</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginTop: '0.2rem' }}>{profile?.companyName || "Belirtilmedi"}</div>
          </div>
          <div className="profile-stat-item">
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sektör</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginTop: '0.2rem' }}>{profile?.industrySector || "Belirtilmedi"}</div>
          </div>
          <div className="profile-stat-item">
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Çalışan Sayısı</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginTop: '0.2rem' }}>{profile?.numberOfEmployees ? Number(profile.numberOfEmployees).toLocaleString('tr-TR') : "Belirtilmedi"}</div>
          </div>
          <div className="profile-stat-item">
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ülke / Konum</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginTop: '0.2rem' }}>{profile?.countryRegion || "Belirtilmedi"}</div>
          </div>
          <div className="profile-stat-item">
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hedef TISAX Seviyesi</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 600, color: '#3b82f6', background: 'rgba(59,130,246,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', marginTop: '0.2rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' }}></span>
              {profile?.tisaxLevel || "Bilinmiyor"}
            </div>
          </div>
          <div className="profile-stat-item">
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Risk İştahı</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 600, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', marginTop: '0.2rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
              {profile?.riskAppetite || "Orta"}
            </div>
          </div>
        </div>
      </section>

      {/* Visualization Section */}
      <section className="card results-main visualization-section">
        <div className="visualization-grid">
          <div className="chart-area">
            <h3>{text.radarChartTitle || "Siber Olgunluk Analizi"}</h3>
            <RadarChart scores={chartScores} />
          </div>
          
          <div className="legend-area">
            <h4>Boyut Bazlı Skorlar</h4>
            <div className="legend-grid">
              {results.sectionScores.map((section) => (
                <div key={section.id} className="legend-item">
                  <div className="legend-info">
                    <span className="legend-label">{section.title}</span>
                    <span className="legend-value">%{section.score}</span>
                  </div>
                  <div className="legend-progress-bg">
                    <div 
                      className="legend-progress-fill" 
                      style={{ width: `${section.score}%`, backgroundColor: '#2563eb' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="card results-main">
        <p className="kicker">{text.stage2Results}</p>
        <div className="score-header">
          <h2>
            {text.readinessScore}: {results.overall}%
          </h2>
          {results.completedAt && (
            <div className="completion-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>Hesaplama Zamanı: {results.completedAt}</span>
            </div>
          )}
        </div>
      </section>

      <section className="card results-main executive-card">
        <h3>{text.executiveSummaryTitle}</h3>
        <p>{executiveSummary}</p>
      </section>

      {/* Yapay Zeka Destekli Uyum Önerileri */}
      <section className="card results-main ai-results-card" style={{ border: '1px dashed rgba(88, 166, 255, 0.35)', background: 'rgba(88, 166, 255, 0.02)' }}>
        <h3 className="ai-results-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-blue)', fontSize: '1.1rem', fontWeight: 600 }}>
          <span className="sparkle-icon-wrapper">✦</span>
          Yapay Zeka Uyum Analizi & Tavsiye Raporu
        </h3>
        <p className="ai-results-description" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', textAlign: 'left' }}>
          Şirketinizin TISAX ({profile?.tisaxLevel || "Bilinmiyor"}) ve ISO/SAE 21434 standartlarına göre siber güvenlik yol haritasını Gemini 3.5 Flash ile özelleştirilmiş olarak oluşturun.
        </p>

        <div className="ai-api-input-row" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginTop: '1rem', marginBottom: '1rem' }}>
          <div className="api-input-wrap" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
            <label htmlFor="dashboard-api-key" style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-main)' }}>Gemini API Anahtarı (API Key)</label>
            <input
              id="dashboard-api-key"
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => {
                const val = e.target.value;
                setApiKey(val);
                localStorage.setItem("tisax_gemini_api_key", val);
              }}
              style={{
                padding: '0.65rem 0.8rem',
                borderRadius: '6px',
                background: 'var(--primary-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
          </div>
          
          <button
            type="button"
            className="ai-generate-btn"
            onClick={handleGenerateAiRecommendations}
            disabled={!apiKey || aiLoading}
          >
            {aiLoading ? (
              <>
                <span className="spinner"></span>
                Analiz Ediliyor...
              </>
            ) : (
              "Önerileri Getir"
            )}
          </button>
        </div>

        {aiError && <div className="ai-error-message">⚠️ {aiError}</div>}

        {aiOneri && (() => {
          const parsed = parseAiOneri(aiOneri);
          const hasCategorized = parsed.zorunlu.length > 0 || parsed.tavsiye.length > 0;
          
          return (
            <div className="ai-report-container" style={{ marginTop: '2rem' }}>
              {/* AI Expert Intro Card */}
              {parsed.intro && (
                <div className="ai-expert-intro-card" style={{
                  background: 'rgba(88, 166, 255, 0.03)',
                  borderLeft: '4px solid var(--accent-blue)',
                  padding: '1.2rem',
                  borderRadius: '0 8px 8px 0',
                  marginBottom: '1.5rem',
                  fontSize: '0.9rem',
                  color: 'var(--text-main)',
                  lineHeight: '1.6',
                  textAlign: 'left'
                }}>
                  {parsed.intro.split('\n').map((l, i) => <p key={i} style={{ margin: '0 0 0.5rem 0' }}>{l.replace(/^[#*-\s]+/, '')}</p>)}
                </div>
              )}

              {hasCategorized ? (
                <div className="ai-recommendations-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  {parsed.zorunlu.length > 0 && (
                    <div className="ai-column must" style={{ background: 'rgba(248, 81, 73, 0.02)', border: '1px solid rgba(248, 81, 73, 0.15)', borderRadius: '12px', padding: '1.25rem' }}>
                      <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ff6b6b', margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff6b6b', boxShadow: '0 0 8px #ff6b6b' }}></span>
                        Zorunlu Öneriler (Must)
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {parsed.zorunlu.map((item, idx) => (
                          <div key={idx} className="ai-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.8rem 1rem', textAlign: 'left' }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                              {item.replace(/^[#*-\s]+/, '')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {parsed.tavsiye.length > 0 && (
                    <div className="ai-column should" style={{ background: 'rgba(59, 130, 246, 0.02)', border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: '12px', padding: '1.25rem' }}>
                      <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-blue)', margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)', boxShadow: '0 0 8px var(--accent-blue)' }}></span>
                        Tavsiye Öneriler (Should)
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {parsed.tavsiye.map((item, idx) => (
                          <div key={idx} className="ai-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.8rem 1rem', textAlign: 'left' }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                              {item.replace(/^[#*-\s]+/, '')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Fallback rendering
                <div className="ai-suggestions-body" style={{ padding: '1.2rem', textAlign: 'left', lineHeight: '1.6', background: 'rgba(255,255,255,0.01)', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                  {aiOneri.split('\n').map((line, idx) => {
                    if (line.trim().startsWith('###')) {
                      return <h6 key={idx} className="ai-heading-3">{line.replace('###', '').trim()}</h6>;
                    }
                    if (line.trim().startsWith('##')) {
                      return <h5 key={idx} className="ai-heading-2">{line.replace('##', '').trim()}</h5>;
                    }
                    if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
                      return <li key={idx} className="ai-bullet">{line.replace(/^[*\-]\s*/, '').trim()}</li>;
                    }
                    return <p key={idx} className="ai-text-line" style={{ margin: '0 0 0.5rem 0' }}>{line}</p>;
                  })}
                </div>
              )}

              {/* AI Expert Outro Card */}
              {parsed.outro && (
                <div className="ai-expert-outro-card" style={{
                  background: 'rgba(255, 255, 255, 0.01)',
                  padding: '1rem 1.2rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.5',
                  textAlign: 'left',
                  border: '1px solid rgba(255, 255, 255, 0.04)'
                }}>
                  {parsed.outro.split('\n').map((l, i) => <p key={i} style={{ margin: '0 0 0.4rem 0' }}>{l.replace(/^[#*-\s]+/, '')}</p>)}
                </div>
              )}
            </div>
          );
        })()}
      </section>

      <section className="card results-main">
        <h3>{text.sectionScores}</h3>
        <div className="score-grid">
          {results.sectionScores.map((section) => (
            <article key={section.id} className="score-item">
              <div>
                <strong>{section.title}</strong>
                <small>
                  {section.answered}/{section.questionCount} {text.answered}
                </small>
              </div>
              <span className={`score-pill ${scoreClass(section.score)}`}>{section.score}%</span>
            </article>
          ))}
        </div>
      </section>

      <section className="card results-main">
        <h3>{text.topRiskAreas}</h3>
        <ul className="result-list">
          {results.lowMaturityAreas.map((area) => (
            <li key={area.id}>
              {area.title} ({area.score}%)
            </li>
          ))}
        </ul>
      </section>

      <section className="card results-main">
        <h3>{text.priorityRecommendations}</h3>
        <ol className="result-list numbered">
          {results.recommendations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
