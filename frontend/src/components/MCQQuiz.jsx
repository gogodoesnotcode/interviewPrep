import { useState } from "react";
import QuestionCard from "./QuestionCard";

export default function MCQQuiz({ quizData, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const currentQuestion = quizData.questions[currentIndex];

  function handleAnswer(selectedIndex) {
    const isCorrect = selectedIndex === currentQuestion.correct_option_index;
    const newAnswer = {
      questionId: currentQuestion.id,
      selectedIndex,
      correct: isCorrect,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (currentIndex < quizData.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(updatedAnswers);
    }
  }

  const progress = ((currentIndex + 1) / quizData.questions.length) * 100;

  return (
    <div>
      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "16px 20px",
          textAlign: "center",
          fontSize: 14,
          color: "#666",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        Question {currentIndex + 1} of {quizData.questions.length}
      </div>

      <div style={{ height: 4, backgroundColor: "#e0e0e0" }}>
        <div
          style={{
            height: "100%",
            backgroundColor: "#1976d2",
            width: `${progress}%`,
            transition: "width 0.3s ease",
          }}
        />
      </div>

      <QuestionCard question={currentQuestion} onAnswer={handleAnswer} />
    </div>
  );
}
