export default function StageIndicator({ step, total, title }) {
  const percentage = Math.round((step / total) * 100);

  return (
    <div className="stage-indicator card">
      <div className="stage-row">
        <div>
          <p className="kicker">Stage 1</p>
          <h2>{title}</h2>
        </div>
        <span>
          Step {step} / {total}
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
