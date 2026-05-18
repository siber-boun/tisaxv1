import RadarChart from './RadarChart';

function scoreClass(score) {
  if (score >= 75) return "score-good";
  if (score >= 45) return "score-mid";
  return "score-low";
}

export default function ScoreDashboard({ results, executiveSummary, text }) {
  // Map scores for radar chart (convert % to 0-4 range)
  const chartScores = results.sectionScores.reduce((acc, section) => {
    acc[section.id] = (section.score / 100) * 4;
    return acc;
  }, {});

  return (
    <div className="results-layout">
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
