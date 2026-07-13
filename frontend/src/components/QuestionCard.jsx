import { useState } from "react";

const LETTERS = ["A", "B", "C", "D"];

export default function QuestionCard({ question, index, total, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  function handleSelect(i) {
    if (!revealed) {
      setSelected(i);
      setRevealed(true);
    }
  }

  function handleNext() {
    onAnswer({
      questionId: question.id,
      selectedIndex: selected,
      correct: selected === question.correct_option_index,
    });
  }

  return (
    <div className="card question-card">
      <div className="question-meta">
        <span className="ticket">
          Q{String(index + 1).padStart(2, "0")} / {total}
        </span>
        <span className="tag">{question.technology}</span>
        <span className={`tag ${question.difficulty === "advanced" ? "tag-advanced" : ""}`}>
          {question.difficulty}
        </span>
      </div>

      <h2 className="question-text">{question.question}</h2>

      <div className="options">
        {question.options.map((option, i) => {
          let stateClass = "";
          if (revealed) {
            if (i === question.correct_option_index) stateClass = "option-correct";
            else if (i === selected) stateClass = "option-incorrect";
          }
          return (
            <button
              key={i}
              className={`option ${stateClass}`}
              onClick={() => handleSelect(i)}
              disabled={revealed}
            >
              <span className="option-letter">{LETTERS[i]}</span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="explanation">
          <p>{question.explanation}</p>
          <button
            className="btn"
            onClick={handleNext}
          >
            {index + 1 === total ? "See results" : "Next question"}
          </button>
        </div>
      )}
    </div>
  );
}
