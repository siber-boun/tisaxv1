export default function StageIndicator({ step, total, title, stageLabel = "Stage 1", stepLabel = "Step" }) {
  const percentage = Math.round((step / total) * 100);

  return (
    <div className="stage-indicator card">
      <div className="stage-row">
        <div>
          <p className="kicker">{stageLabel}</p>
          <h2>{title}</h2>
        </div>
        <span>
          {stepLabel} {step} / {total}
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
