export default function QuizSummary({ answers, quizData, onRetake }) {
  const score = answers.filter((a) => a.correct).length;
  const total = answers.length;
  const percentage = total ? Math.round((score / total) * 100) : 0;

  const byProject = {};
  quizData.questions.forEach((q, idx) => {
    if (!byProject[q.project_name]) {
      byProject[q.project_name] = { correct: 0, total: 0 };
    }
    byProject[q.project_name].total += 1;
    if (answers[idx]?.correct) {
      byProject[q.project_name].correct += 1;
    }
  });

  const projectEntries = Object.entries(byProject).sort(
    (a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total
  );

  return (
    <div>
      <p className="eyebrow">RESULTS</p>
      <div className="card score-card">
        <p className="score-number">
          {score}/{total}
        </p>
        <p className="score-percent">{percentage}% CORRECT</p>
      </div>

      <h3 className="section-title small">By project</h3>
      <div className="breakdown">
        {projectEntries.map(([name, stats]) => (
          <div className="breakdown-row" key={name}>
            <span className="breakdown-name">{name}</span>
            <div className="breakdown-bar-track">
              <div
                className="breakdown-bar-fill"
                style={{ width: `${(stats.correct / stats.total) * 100}%` }}
              />
            </div>
            <span className="breakdown-fraction">{stats.correct}/{stats.total}</span>
          </div>
        ))}
      </div>

      <button className="btn" onClick={onRetake}>Practice again</button>
    </div>
  );
}
