function scoreClass(score) {
  if (score >= 75) return "score-good";
  if (score >= 45) return "score-mid";
  return "score-low";
}

export default function ScoreDashboard({ results, executiveSummary, text }) {
  return (
    <div className="results-layout">
      <section className="card results-main">
        <p className="kicker">{text.stage2Results}</p>
        <h2>
          {text.readinessScore}: {results.overall}%
        </h2>
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
