export default function AssessmentSectionCard({ section, answers, errors, onAnswer, maturityOptions }) {
  return (
    <section className="card section assessment-section">
      <h3>{section.title}</h3>
      <p>{section.helper}</p>

      <div className="question-list">
        {section.questions.map((question, index) => (
          <article key={question.id} className="question-card">
            <h4>
              {index + 1}. {question.text}
            </h4>
            {question.helper ? <small>{question.helper}</small> : null}

            <div className="maturity-options">
              {maturityOptions.map((level) => (
                <label key={level.value} className={`maturity-chip ${answers[question.id] === level.value ? "active" : ""}`}>
                  <input
                    type="radio"
                    name={question.id}
                    value={level.value}
                    checked={answers[question.id] === level.value}
                    onChange={() => onAnswer(question.id, level.value)}
                  />
                  <span>{level.label}</span>
                </label>
              ))}
            </div>
            {errors[question.id] ? <em className="error">{errors[question.id]}</em> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
