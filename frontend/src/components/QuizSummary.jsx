export default function QuizSummary({ answers, quizData, onRetake }) {
  const score = answers.filter((a) => a.correct).length;
  const total = answers.length;
  const percentage = Math.round((score / total) * 100);

  // Group questions by project
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
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px" }}>
      <div
        style={{
          textAlign: "center",
          padding: 32,
          backgroundColor: "#f5f5f5",
          borderRadius: 8,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: percentage >= 70 ? "#2e7d32" : percentage >= 50 ? "#f57c00" : "#c62828",
            marginBottom: 8,
          }}
        >
          {percentage}%
        </div>
        <div style={{ fontSize: 18, color: "#333", marginBottom: 4 }}>
          {score} of {total} correct
        </div>
        <div style={{ fontSize: 14, color: "#666" }}>
          {percentage >= 70 ? "Great job!" : percentage >= 50 ? "Good effort!" : "Keep practicing!"}
        </div>
      </div>

      <h3 style={{ margin: "0 0 16px 0", color: "#333", fontSize: 18 }}>
        Breakdown by Project
      </h3>

      <div style={{ marginBottom: 32 }}>
        {projectEntries.map(([projectName, stats]) => {
          const projectPercentage = Math.round((stats.correct / stats.total) * 100);
          return (
            <div
              key={projectName}
              style={{
                padding: 16,
                border: "1px solid #e0e0e0",
                borderRadius: 4,
                marginBottom: 12,
                backgroundColor: "#fafafa",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <span style={{ fontWeight: 600, color: "#333" }}>
                  {projectName}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    color:
                      projectPercentage >= 70
                        ? "#2e7d32"
                        : projectPercentage >= 50
                          ? "#f57c00"
                          : "#c62828",
                    fontWeight: 600,
                  }}
                >
                  {projectPercentage}%
                </span>
              </div>
              <div style={{ height: 8, backgroundColor: "#e0e0e0", borderRadius: 4, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    backgroundColor:
                      projectPercentage >= 70
                        ? "#4caf50"
                        : projectPercentage >= 50
                          ? "#ff9800"
                          : "#f44336",
                    width: `${projectPercentage}%`,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
                {stats.correct} of {stats.total} correct
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onRetake}
        style={{
          width: "100%",
          padding: "14px 16px",
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: 4,
          fontSize: 16,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Try Again
      </button>
    </div>
  );
}
