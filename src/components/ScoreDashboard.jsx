function scoreClass(score) {
  if (score >= 75) return "score-good";
  if (score >= 45) return "score-mid";
  return "score-low";
}

export default function ScoreDashboard({ results }) {
  return (
    <div className="results-layout">
      <section className="card results-main">
        <p className="kicker">Stage 2 Results</p>
        <h2>Cybersecurity Readiness Score: {results.overall}%</h2>
        <p>{results.summary}</p>
      </section>

      <section className="card results-main">
        <h3>Section Scores</h3>
        <div className="score-grid">
          {results.sectionScores.map((section) => (
            <article key={section.id} className="score-item">
              <div>
                <strong>{section.title}</strong>
                <small>
                  {section.answered}/{section.questionCount} answered
                </small>
              </div>
              <span className={`score-pill ${scoreClass(section.score)}`}>{section.score}%</span>
            </article>
          ))}
        </div>
      </section>

      <section className="card results-main">
        <h3>Top High-Risk Areas</h3>
        <ul className="result-list">
          {results.lowMaturityAreas.map((area) => (
            <li key={area.id}>
              {area.title} ({area.score}%)
            </li>
          ))}
        </ul>
      </section>

      <section className="card results-main">
        <h3>Priority Recommendations</h3>
        <ol className="result-list numbered">
          {results.recommendations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
