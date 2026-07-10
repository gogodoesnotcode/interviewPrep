import { useState } from "react";

export default function QuestionCard({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  function handleOptionClick(index) {
    if (!revealed) {
      setSelected(index);
      setRevealed(true);
    }
  }

  function handleNext() {
    onAnswer(selected);
    setSelected(null);
    setRevealed(false);
  }

  const isCorrect = selected === question.correct_option_index;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginBottom: 16,
            color: "#666",
            fontSize: 13,
          }}
        >
          <span
            style={{
              backgroundColor: "#e3f2fd",
              color: "#1976d2",
              padding: "4px 10px",
              borderRadius: 4,
              fontWeight: 500,
            }}
          >
            {question.project_name}
          </span>
          <span
            style={{
              backgroundColor: "#f3e5f5",
              color: "#7b1fa2",
              padding: "4px 10px",
              borderRadius: 4,
              fontWeight: 500,
            }}
          >
            {question.technology}
          </span>
          <span
            style={{
              backgroundColor:
                question.difficulty === "basic"
                  ? "#e8f5e9"
                  : question.difficulty === "intermediate"
                    ? "#fff3e0"
                    : "#fce4ec",
              color:
                question.difficulty === "basic"
                  ? "#2e7d32"
                  : question.difficulty === "intermediate"
                    ? "#e65100"
                    : "#c2185b",
              padding: "4px 10px",
              borderRadius: 4,
              fontWeight: 500,
              textTransform: "capitalize",
            }}
          >
            {question.difficulty}
          </span>
        </div>
        <h2 style={{ margin: 0, color: "#333", fontSize: 20, lineHeight: 1.5 }}>
          {question.question}
        </h2>
      </div>

      <div style={{ marginBottom: 32 }}>
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(index)}
            disabled={revealed}
            style={{
              display: "block",
              width: "100%",
              padding: "16px",
              marginBottom: 12,
              backgroundColor:
                revealed && index === question.correct_option_index
                  ? "#c8e6c9"
                  : revealed && index === selected && !isCorrect
                    ? "#ffcdd2"
                    : "#f5f5f5",
              border:
                selected === index && !revealed
                  ? "2px solid #1976d2"
                  : "1px solid #ddd",
              borderRadius: 4,
              fontSize: 16,
              cursor: revealed ? "default" : "pointer",
              textAlign: "left",
              fontWeight: selected === index && !revealed ? 600 : 400,
              color: "#333",
            }}
          >
            {option}
            {revealed && index === question.correct_option_index && " ✓"}
            {revealed && index === selected && !isCorrect && " ✗"}
          </button>
        ))}
      </div>

      {revealed && (
        <div style={{ marginBottom: 24 }}>
          <p
            style={{
              padding: 12,
              backgroundColor: isCorrect ? "#e8f5e9" : "#fff3e0",
              color: isCorrect ? "#2e7d32" : "#e65100",
              borderRadius: 4,
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            <strong>{isCorrect ? "Correct!" : "Incorrect."}</strong> {question.explanation}
          </p>
        </div>
      )}

      {revealed && (
        <button
          onClick={handleNext}
          style={{
            width: "100%",
            padding: "12px 16px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: 4,
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Next
        </button>
      )}
    </div>
  );
}
