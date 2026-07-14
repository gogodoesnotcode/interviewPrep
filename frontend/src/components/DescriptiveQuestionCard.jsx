import { useState } from "react";
import { evaluateAnswer } from "../api/client";

export default function DescriptiveQuestionCard({ question, index, total, onSubmitted }) {
  const [answerText, setAnswerText] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!answerText.trim()) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await evaluateAnswer(question, answerText);
      setEvaluation(result);
    } catch (err) {
      setError("Couldn't grade that answer. Try submitting again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNext() {
    onSubmitted(evaluation);
  }

  return (
    <div className="card question-card">
      <div className="question-meta">
        <span className="ticket">Q{String(index + 1).padStart(2, "0")} / {total}</span>
        <span className="tag">{question.technology}</span>
      </div>

      <h2 className="question-text">{question.question}</h2>

      {!evaluation ? (
        <form onSubmit={handleSubmit} className="answer-form">
          <textarea
            className="textarea"
            placeholder="Write a few sentences, like you'd say it out loud in an interview…"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            rows={6}
          />
          <button className="btn" type="submit" disabled={!answerText.trim() || isSubmitting}>
            {isSubmitting ? "Grading…" : "Submit answer"}
          </button>
          {error && <p className="error-text">{error}</p>}
        </form>
      ) : (
        <div className="evaluation">
          <div className="score-badge">{evaluation.score}</div>
          <p className="eval-feedback">{evaluation.feedback}</p>

          {evaluation.covered_points.length > 0 && (
            <ul className="point-list">
              {evaluation.covered_points.map((point) => (
                <li className="point point-covered" key={point}>{point}</li>
              ))}
            </ul>
          )}
          {evaluation.missed_points.length > 0 && (
            <ul className="point-list">
              {evaluation.missed_points.map((point) => (
                <li className="point point-missed" key={point}>{point}</li>
              ))}
            </ul>
          )}

          <button className="btn" onClick={handleNext}>
            {index + 1 === total ? "See results" : "Next question"}
          </button>
        </div>
      )}
    </div>
  );
}