export default function DescriptiveSummary({ evaluations, onRetake }) {
  const average = Math.round(
    evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length
  );

  return (
    <div>
      <p className="eyebrow">RESULTS</p>
      <div className="card score-card">
        <p className="score-number">{average}</p>
        <p className="score-percent">AVERAGE SCORE</p>
      </div>

      <h3 className="section-title small">By question</h3>
      <div className="breakdown">
        {evaluations.map((evaluation, i) => (
          <div className="breakdown-row" key={evaluation.question_id}>
            <span className="breakdown-name">Question {i + 1}</span>
            <div className="breakdown-bar-track">
              <div className="breakdown-bar-fill" style={{ width: `${evaluation.score}%` }} />
            </div>
            <span className="breakdown-fraction">{evaluation.score}</span>
          </div>
        ))}
      </div>

      <button className="btn" onClick={onRetake}>Practice again</button>
    </div>
  );
}