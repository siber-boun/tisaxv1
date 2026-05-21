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
    if (lower.includes('zorunlu') || lower.includes('must') || lower.includes('kategori 1')) {
      currentCategory = 'zorunlu';
      continue;
    }
    if (lower.includes('tavsiye') || lower.includes('should') || lower.includes('kategori 2') || lower.includes('önerilenler')) {
      currentCategory = 'tavsiye';
      continue;
    }
    if ((lower.includes('matris') || lower.includes('matri̇s') || lower.includes('önceliklendirme') || lower.includes('aksiyon')) && 
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

function parseInlineStyles(txt) {
  if (!txt) return null;
  // Clean up bullet list prefixes if present
  const cleanTxt = txt.trim().replace(/^[\*\-\+]\s+/, "");
  const parts = cleanTxt.split('**');
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} style={{ fontWeight: 700, color: '#fff' }}>{part}</strong>;
    }
    return part;
  });
}

function renderMarkdown(text) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let inTable = false;
  let tableRows = [];
  let inList = false;
  let listItems = [];

  const flushList = (key) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${key}`} style={{ paddingLeft: '1.5rem', margin: '0 0 1rem 0', color: 'var(--text-main)', textAlign: 'left' }}>
          {listItems.map((li, i) => (
            <li key={i} style={{ marginBottom: '0.4rem', lineHeight: '1.5', fontSize: '0.9rem' }}>{li}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
    inList = false;
  };

  const flushTable = (key) => {
    if (tableRows.length > 0) {
      const headers = tableRows[0];
      const rows = tableRows.slice(1).filter(row => !row.every(c => c.trim().match(/^-+$/)));
      elements.push(
        <div key={`table-wrapper-${key}`} style={{ overflowX: 'auto', margin: '1rem 0', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: 'var(--text-main)' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {headers.map((h, i) => (
                  <th key={i} style={{ padding: '0.6rem 0.8rem', textAlign: 'left', fontWeight: 600, borderRight: '1px solid rgba(255,255,255,0.04)' }}>{h.trim()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: rIdx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} style={{ padding: '0.6rem 0.8rem', borderRight: '1px solid rgba(255,255,255,0.04)' }}>{cell.trim()}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }
    inTable = false;
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('|')) {
      flushList(idx);
      inTable = true;
      const cells = trimmed.split('|').slice(1, -1);
      tableRows.push(cells);
      return;
    } else if (inTable && !trimmed.startsWith('|')) {
      flushTable(idx);
    }

    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      inList = true;
      listItems.push(parseInlineStyles(trimmed.substring(2)));
      return;
    } else if (inList && !(trimmed.startsWith('* ') || trimmed.startsWith('- '))) {
      flushList(idx);
    }

    if (trimmed.startsWith('###')) {
      elements.push(<h5 key={idx} style={{ fontSize: '1rem', color: '#fff', fontWeight: 600, margin: '1.25rem 0 0.5rem 0', textAlign: 'left' }}>{parseInlineStyles(trimmed.replace('###', '').trim())}</h5>);
    } else if (trimmed.startsWith('##')) {
      elements.push(<h4 key={idx} style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 600, margin: '1.5rem 0 0.75rem 0', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem' }}>{parseInlineStyles(trimmed.replace('##', '').trim())}</h4>);
    } else if (trimmed.startsWith('#')) {
      elements.push(<h3 key={idx} style={{ fontSize: '1.3rem', color: '#fff', fontWeight: 600, margin: '1.75rem 0 1rem 0', textAlign: 'left' }}>{parseInlineStyles(trimmed.replace('#', '').trim())}</h3>);
    } else if (trimmed) {
      elements.push(<p key={idx} style={{ margin: '0 0 0.75rem 0', lineHeight: '1.6', fontSize: '0.95rem', color: 'var(--text-main)', textAlign: 'left' }}>{parseInlineStyles(trimmed)}</p>);
    }
  });

  flushList(lines.length);
  flushTable(lines.length);

  return elements;
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
                text: `Sen üst düzey bir kurumsal tasarımcı ve siber güvenlik stratejistisin. Aşağıdaki teknik raporu, C-level yöneticiler için modern, şık ve güven veren bir Dijital Rapor Formatına dönüştürmeni istiyorum.

                Tasarım Prensipleri:
                - Stil: Minimalist, kurumsal, C-level seviyesinde net, çözüm odakli ve 'Tech-Forward'.
                - Renk Paleti: Siber güvenliği temsil eden lacivert, güven veren gri tonları ve 'Zorunlu' maddeler için dikkat çekici bir bordo tonu kullan.
                - Öğeler: Her maddeyi modern bir 'kart' yapısı şeklinde sun. Her maddenin başına konuyu özetleyen sembolik ikonlar (örn: 🛡️, ⚙️, 🏢, 🔑, 💻, 📊) ekle.
                - Okunabilirlik: Karmaşık teknik paragrafları, madde imleri ve kısa, vurucu cümlelerle (bullet points) modernize et.

                Kurum Bilgileri:
                - Kurum / Şirket Adı: ${profile?.companyName || "Belirtilmedi"}
                - Sektör: ${sektor}
                - Şirket Ölçeği: ${sirketBuyuklugu}
                - Çalışan Sayısı: ${profile?.numberOfEmployees || "Belirtilmedi"}
                - Ofis Sayısı: ${profile?.officeLocations || "Belirtilmedi"}
                - Ülke / Konum: ${profile?.countryRegion || "Belirtilmedi"}
                - Mevcut / Hedeflenen TISAX Seviyesi: ${tisaxDuzeyi}
                - Risk İştahı: ${riskIstahi}

                Görev:
                1. Raporun en başına, yukarıdaki verileri içeren büyük puntolu bir 'Yönetici Özeti' ve kritik metrikleri gösteren bir tablo (markdown table formatında) ekle.
                2. Önerileri mutlaka ikiye ayır: "Zorunlu Öneriler (Yapılmalı)" ve "Tavsiye Edilen Öneriler (Yapılabilir)".
                3. Raporun sonunda, önerileri aksiyon durumuna göre kategorize eden bir 'Önceliklendirme Matrisi' (markdown tablo formatında) oluştur.`
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
                  background: 'rgba(27, 38, 59, 0.05)',
                  borderLeft: '4px solid #415a77',
                  padding: '1.5rem',
                  borderRadius: '0 8px 8px 0',
                  marginBottom: '2rem',
                  fontSize: '0.95rem',
                  color: 'var(--text-main)',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  border: '1px solid rgba(65, 90, 119, 0.15)',
                  borderLeftWidth: '4px'
                }}>
                  {renderMarkdown(parsed.intro)}
                </div>
              )}

              {hasCategorized ? (
                <div className="ai-recommendations-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  {parsed.zorunlu.length > 0 && (
                    <div className="insight-card must" style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.3)'
                    }}>
                      <div style={{ height: '3px', background: 'linear-gradient(90deg, #9b1c1c, #e05a5a)' }} />

                      <header style={{
                        padding: '20px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        background: 'linear-gradient(135deg, rgba(155, 28, 28, 0.15) 0%, rgba(0, 0, 0, 0) 100%)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            fontSize: '1.3rem',
                            background: 'rgba(155, 28, 28, 0.2)',
                            color: '#ff6b6b',
                            border: '1px solid rgba(155, 28, 28, 0.3)',
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>🛡️</span>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#fca5a5', letterSpacing: '0.02em', textAlign: 'left' }}>Zorunlu Uyumluluk</h3>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(155, 28, 28, 0.3)', color: '#fca5a5', border: '1px solid rgba(155, 28, 28, 0.5)' }}>Must</span>
                      </header>
                      
                      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '0.75rem', flexGrow: 1 }}>
                        {parsed.zorunlu.map((item, idx) => (
                          <div key={idx} style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            border: '1px solid rgba(255,255,255,0.06)', 
                            borderRadius: '8px', 
                            padding: '1rem', 
                            textAlign: 'left', 
                            fontSize: '0.92rem', 
                            color: 'var(--text-main)', 
                            lineHeight: '1.5',
                            transition: 'background 0.2s ease, border-color 0.2s ease',
                            cursor: 'default'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                            e.currentTarget.style.borderColor = 'rgba(155, 28, 28, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                          }}>
                            {parseInlineStyles(item)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {parsed.tavsiye.length > 0 && (
                    <div className="insight-card should" style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.3)'
                    }}>
                      <div style={{ height: '3px', background: 'linear-gradient(90deg, #1e3a8a, #60a5fa)' }} />

                      <header style={{
                        padding: '20px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.2) 0%, rgba(0, 0, 0, 0) 100%)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            fontSize: '1.3rem',
                            background: 'rgba(30, 58, 138, 0.3)',
                            color: '#60a5fa',
                            border: '1px solid rgba(30, 58, 138, 0.4)',
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>💡</span>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#93c5fd', letterSpacing: '0.02em', textAlign: 'left' }}>Stratejik Tavsiyeler</h3>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(30, 58, 138, 0.4)', color: '#93c5fd', border: '1px solid rgba(30, 58, 138, 0.6)' }}>Should</span>
                      </header>
                      
                      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '0.75rem', flexGrow: 1 }}>
                        {parsed.tavsiye.map((item, idx) => (
                          <div key={idx} style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            border: '1px solid rgba(255,255,255,0.06)', 
                            borderRadius: '8px', 
                            padding: '1rem', 
                            textAlign: 'left', 
                            fontSize: '0.92rem', 
                            color: 'var(--text-main)', 
                            lineHeight: '1.5',
                            transition: 'background 0.2s ease, border-color 0.2s ease',
                            cursor: 'default'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                            e.currentTarget.style.borderColor = 'rgba(30, 58, 138, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                          }}>
                            {parseInlineStyles(item)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Fallback rendering
                <div className="ai-suggestions-body" style={{ padding: '1.2rem', textAlign: 'left', lineHeight: '1.6', background: 'rgba(255,255,255,0.01)', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                  {renderMarkdown(aiOneri)}
                </div>
              )}

              {/* AI Expert Outro / Priority Matrix Card */}
              {parsed.outro && (
                <div className="ai-expert-outro-card" style={{
                  background: 'rgba(255, 255, 255, 0.01)',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  color: 'var(--text-main)',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  marginTop: '1.5rem'
                }}>
                  {renderMarkdown(parsed.outro)}
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
