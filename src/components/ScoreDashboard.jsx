import React, { useState } from 'react';
import RadarChart from './RadarChart';

function scoreClass(score) {
  if (score >= 75) return "score-good";
  if (score >= 45) return "score-mid";
  return "score-low";
}


function parseAiOneri(text) {
  if (!text) return { intro: "", zorunlu: [], tavsiye: [], outro: "" };
  try {
    const parsed = JSON.parse(text);
    return {
      intro:   typeof parsed.intro  === 'string' ? parsed.intro  : "",
      zorunlu: Array.isArray(parsed.zorunlu)      ? parsed.zorunlu : [],
      tavsiye: Array.isArray(parsed.tavsiye)      ? parsed.tavsiye : [],
      outro:   typeof parsed.outro  === 'string' ? parsed.outro  : "",
    };
  } catch {
    return { intro: "", zorunlu: [], tavsiye: [], outro: "" };
  }
}

// Render inline markdown: **bold**, *italic*, `code`
// Priority: bold (**) MUST be matched before italic (*)
function parseInlineStyles(txt, stripBullet = false) {
  if (!txt) return null;

  let cleanTxt = txt.trim();
  if (stripBullet) {
    // Remove leading bullet: "* ", "- ", "+ "
    cleanTxt = cleanTxt.replace(/^[-*+]\s+/, '');
  }

  // Split by bold first (**...**), then code (`...`), then italic (*...*)
  // Using alternation with bold before italic to avoid greedy mismatch
  const TOKEN = /(\*\*[^*]+?\*\*|`[^`]+?`|\*(?!\*)[^*]+?\*)/g;
  const result = [];
  let lastIndex = 0;
  let match;

  while ((match = TOKEN.exec(cleanTxt)) !== null) {
    // Push plain text before this match
    if (match.index > lastIndex) {
      result.push(cleanTxt.slice(lastIndex, match.index));
    }
    const token = match[0];
    const key = match.index;
    if (token.startsWith('**')) {
      result.push(<strong key={key} style={{ fontWeight: 700, color: 'var(--text-main)' }}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`')) {
      result.push(<code key={key} style={{ background: 'var(--border-color)', padding: '2px 5px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.85em', color: 'var(--accent-red)' }}>{token.slice(1, -1)}</code>);
    } else {
      result.push(<em key={key} style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>{token.slice(1, -1)}</em>);
    }
    lastIndex = TOKEN.lastIndex;
  }

  // Push remaining plain text
  if (lastIndex < cleanTxt.length) {
    result.push(cleanTxt.slice(lastIndex));
  }

  return result.length > 0 ? result : cleanTxt;
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
                  <th key={i} style={{ padding: '0.6rem 0.8rem', textAlign: 'left', fontWeight: 600, borderRight: '1px solid rgba(255,255,255,0.04)' }}>{parseInlineStyles(h.trim())}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: rIdx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} style={{ padding: '0.6rem 0.8rem', borderRight: '1px solid rgba(255,255,255,0.04)' }}>{parseInlineStyles(cell.trim())}</td>
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
      elements.push(<h5 key={idx} style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 600, margin: '1.25rem 0 0.5rem 0', textAlign: 'left' }}>{parseInlineStyles(trimmed.replace(/^###\s*/, '').trim())}</h5>);
    } else if (trimmed.startsWith('##')) {
      elements.push(<h4 key={idx} style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 600, margin: '1.5rem 0 0.75rem 0', textAlign: 'left', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>{parseInlineStyles(trimmed.replace(/^##\s*/, '').trim())}</h4>);
    } else if (trimmed.startsWith('#')) {
      elements.push(<h3 key={idx} style={{ fontSize: '1.3rem', color: 'var(--text-main)', fontWeight: 600, margin: '1.75rem 0 1rem 0', textAlign: 'left' }}>{parseInlineStyles(trimmed.replace(/^#\s*/, '').trim())}</h3>);
    } else if (trimmed) {
      elements.push(<p key={idx} style={{ margin: '0 0 0.75rem 0', lineHeight: '1.6', fontSize: '0.95rem', color: 'var(--text-main)', textAlign: 'left' }}>{parseInlineStyles(trimmed)}</p>);
    }
  });

  flushList(lines.length);
  flushTable(lines.length);

  return elements;
}

const MATURITY_LABEL = {
  not_implemented:      "❌ Uygulanmadı",
  partially_implemented:"⚠️ Kısmen Uygulandı",
  defined:              "📋 Tanımlı",
  managed:              "✅ Yönetilen",
  optimized:            "🚀 Optimize",
};

export default function ScoreDashboard({ results, executiveSummary, text, profile, answers = {}, sections = [] }) {
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
                text: `Sen üst düzey bir siber güvenlik stratejisti ve TISAX/ISO 21434 uzmanısın. Aşağıdaki kurum profili ve olgunluk değerlendirmesi sonuçlarına dayanarak kapsamlı bir uyum analizi ve aksiyon raporu oluştur.

Kurum Bilgileri:
- Kurum Adı: ${profile?.companyName || "Belirtilmedi"}
- Sektör: ${sektor}
- Ölçek: ${sirketBuyuklugu}
- Çalışan Sayısı: ${profile?.numberOfEmployees || "Belirtilmedi"}
- Ofis Sayısı: ${profile?.officeLocations || "Belirtilmedi"}
- Ülke: ${profile?.countryRegion || "Belirtilmedi"}
- Hedef TISAX Seviyesi: ${tisaxDuzeyi}
- Risk İştahı: ${riskIstahi}

Olgunluk Değerlendirmesi Sonuçları (Genel Skor: %${results.overall}):
${results.sectionScores.map(s => `- ${s.title}: %${s.score} (${s.score < 40 ? '🔴 Kritik' : s.score < 70 ? '🟡 Geliştirilmeli' : '🟢 Yeterli'})`).join('\n')}

Kritik Zayıf Alanlar (öncelikli ele alınmalı):
${results.lowMaturityAreas.length > 0 ? results.lowMaturityAreas.map(a => `- ${a.title}: %${a.score}`).join('\n') : '- Yok'}

Soru Bazlı Cevaplar:
${sections.map(section => `[${section.title}]\n${section.questions.map(q => `  - ${q.text}: ${MATURITY_LABEL[answers[q.id]] || '— Cevaplanmadı'}`).join('\n')}`).join('\n\n')}

Alan açıklamaları:
- intro: Yönetici özeti. Genel skor ve zayıf alanlara atıfla 2-3 paragraflık özet yaz, ardından skor tablosu ekle (Alan | Skor | Durum sütunları).
- zorunlu: Zayıf alanlar öncelikli olmak üzere TISAX/ISO 21434 uyumu için mutlaka yapılması gereken en az 5 aksiyon. Her madde "🛡️ **Başlık**: Somut adımlar içeren açıklama (hangi alan, neden kritik, ne yapılmalı)" formatında olsun.
- tavsiye: Orta ve iyi skorlu alanları daha da güçlendirecek en az 4 stratejik öneri. Her madde "💡 **Başlık**: Somut uygulama adımları içeren açıklama" formatında olsun.
- outro: Önceliklendirme matrisi. Tablo sütunları: Aksiyon | Etkilenen Alan | Öncelik | Tahmini Süre | Beklenen Etki.`
              }]
            }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "OBJECT",
                properties: {
                  intro:   { type: "STRING" },
                  zorunlu: { type: "ARRAY", items: { type: "STRING" } },
                  tavsiye: { type: "ARRAY", items: { type: "STRING" } },
                  outro:   { type: "STRING" },
                },
                required: ["intro", "zorunlu", "tavsiye", "outro"],
              },
            },
          })
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP Hata: ${response.status}`);
      }

      const data = await response.json();

      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
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
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 600 }}>Kurum Profili & Değerlendirme Kapsamı</h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Değerlendirilen kuruluşa ait kurumsal parametreler</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          <div className="profile-stat-item">
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kurum Adı</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>{profile?.companyName || "Belirtilmedi"}</div>
          </div>
          <div className="profile-stat-item">
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sektör</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>{profile?.industrySector || "Belirtilmedi"}</div>
          </div>
          <div className="profile-stat-item">
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Çalışan Sayısı</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>{profile?.numberOfEmployees ? Number(profile.numberOfEmployees).toLocaleString('tr-TR') : "Belirtilmedi"}</div>
          </div>
          <div className="profile-stat-item">
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ülke / Konum</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>{profile?.countryRegion || "Belirtilmedi"}</div>
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

        <div className="ai-api-input-row" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginTop: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div className="api-input-wrap" style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
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

          {aiOneri && (
            <button
              type="button"
              onClick={() => {
                setAiOneri("");
                localStorage.removeItem("tisax_ai_oneri");
              }}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: '6px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                whiteSpace: 'nowrap'
              }}
            >
              🗑 Sıfırla
            </button>
          )}
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
                            background: 'rgba(155, 28, 28, 0.15)',
                            color: '#c0392b',
                            border: '1px solid rgba(155, 28, 28, 0.3)',
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>🛡️</span>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-red)', letterSpacing: '0.02em', textAlign: 'left' }}>Zorunlu Uyumluluk</h3>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(155, 28, 28, 0.15)', color: 'var(--accent-red)', border: '1px solid rgba(155, 28, 28, 0.4)' }}>Must</span>
                      </header>
                      
                      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '0.75rem', flexGrow: 1 }}>
                        {parsed.zorunlu.map((item, idx) => (
                          <div key={idx} style={{ 
                            background: 'var(--secondary-bg)', 
                            border: '1px solid var(--border-color)', 
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
                            e.currentTarget.style.borderColor = 'rgba(155, 28, 28, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                          }}>
                            {parseInlineStyles(item, true)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {parsed.tavsiye.length > 0 && (
                    <div className="insight-card should" style={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
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
                        borderBottom: '1px solid var(--border-color)',
                        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, transparent 100%)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            fontSize: '1.3rem',
                            background: 'rgba(30, 58, 138, 0.15)',
                            color: 'var(--accent-blue)',
                            border: '1px solid rgba(30, 58, 138, 0.3)',
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>💡</span>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-blue)', letterSpacing: '0.02em', textAlign: 'left' }}>Stratejik Tavsiyeler</h3>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(30, 58, 138, 0.15)', color: 'var(--accent-blue)', border: '1px solid rgba(30, 58, 138, 0.4)' }}>Should</span>
                      </header>
                      
                      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '0.75rem', flexGrow: 1 }}>
                        {parsed.tavsiye.map((item, idx) => (
                          <div key={idx} style={{ 
                            background: 'var(--secondary-bg)', 
                            border: '1px solid var(--border-color)', 
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
                            e.currentTarget.style.borderColor = 'rgba(30, 58, 138, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                          }}>
                            {parseInlineStyles(item, true)}
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
