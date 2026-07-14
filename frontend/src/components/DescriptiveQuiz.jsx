import { useState } from "react";
import DescriptiveQuestionCard from "./DescriptiveQuestionCard";

export default function DescriptiveQuiz({ questions, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [evaluations, setEvaluations] = useState([]);

  function handleSubmitted(evaluation) {
    const next = [...evaluations, evaluation];
    if (currentIndex + 1 === questions.length) {
      onComplete(next);
    } else {
      setEvaluations(next);
      setCurrentIndex(currentIndex + 1);
    }
  }

  return (
    <div>
      <p className="eyebrow">WRITTEN PRACTICE</p>
      <DescriptiveQuestionCard
        key={questions[currentIndex].id}
        question={questions[currentIndex]}
        index={currentIndex}
        total={questions.length}
        onSubmitted={handleSubmitted}
      />
    </div>
  );
}