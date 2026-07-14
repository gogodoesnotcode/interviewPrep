
import { useState } from "react";
import ResumeUpload from "./components/ResumeUpload";
import ResumeSummary from "./components/ResumeSummary";
import MCQQuiz from "./components/MCQQuiz";
import QuizSummary from "./components/QuizSummary";
import DescriptiveQuiz from "./components/DescriptiveQuiz";
import DescriptiveSummary from "./components/DescriptiveSummary";
import "./styles.css";

export default function App() {
  const [screen, setScreen] = useState("upload");
  const [resumeData, setResumeData] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [descriptiveQuestions, setDescriptiveQuestions] = useState(null);
  const [descriptiveEvaluations, setDescriptiveEvaluations] = useState([]);

  return (
    <div className="app-shell">
      <div className="brand">
        <span className="brand-mark">IP</span>
        <span className="brand-name">Interview Prep</span>
      </div>

      {screen === "upload" && (
        <ResumeUpload
          onParsed={(r) => {
            setResumeData(r);
            setScreen("summary");
          }}
        />
      )}
      {screen === "summary" && (
        <ResumeSummary
          resumeData={resumeData}
          onMcqStart={(q) => {
            setQuizData(q);
            setScreen("mcq");
          }}
          onDescriptiveStart={(questions) => {
            setDescriptiveQuestions(questions);
            setScreen("descriptive");
          }}
        />
      )}
      {screen === "mcq" && (
        <MCQQuiz
          quizData={quizData}
          onComplete={(answers) => {
            setQuizAnswers(answers);
            setScreen("mcq-results");
          }}
        />
      )}
      {screen === "mcq-results" && (
        <QuizSummary
          answers={quizAnswers}
          quizData={quizData}
          onRetake={() => setScreen("summary")}
        />
      )}
      {screen === "descriptive" && (
        <DescriptiveQuiz
          questions={descriptiveQuestions}
          onComplete={(evaluations) => {
            setDescriptiveEvaluations(evaluations);
            setScreen("descriptive-results");
          }}
        />
      )}
      {screen === "descriptive-results" && (
        <DescriptiveSummary
          evaluations={descriptiveEvaluations}
          onRetake={() => setScreen("summary")}
        />
      )}
    </div>
  );
}