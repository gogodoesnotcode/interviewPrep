import { useState } from "react";
import QuestionCard from "./QuestionCard";

export default function MCQQuiz({ quizData, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  function handleAnswer(result) {
    const next = [...answers, result];

    if (currentIndex + 1 === quizData.questions.length) {
      onComplete(next);
    } else {
      setAnswers(next);
      setCurrentIndex(currentIndex + 1);
    }
  }

  return (
    <div>
      <p className="eyebrow">STEP 3 OF 3</p>
      <QuestionCard
        key={quizData.questions[currentIndex].id}
        question={quizData.questions[currentIndex]}
        index={currentIndex}
        total={quizData.questions.length}
        onAnswer={handleAnswer}
      />
    </div>
  );
}
