
import { useState } from "react";
import ResumeUpload from "./components/ResumeUpload";
import ResumeSummary from "./components/ResumeSummary";
import MCQQuiz from "./components/MCQQuiz";
import QuizSummary from "./components/QuizSummary";

export default function App() {
  const [screen, setScreen] = useState("upload");
  const [resumeData, setResumeData] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState([]);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1>Resume Interview Prep</h1>

      {screen === "upload" && (
        <ResumeUpload onParsed={(r) => { setResumeData(r); setScreen("summary"); }} />
      )}
      {screen === "summary" && (
        <ResumeSummary resumeData={resumeData}
          onMcqStart={(q) => { setQuizData(q); setScreen("mcq"); }} />
      )}
      {screen === "mcq" && (
        <MCQQuiz quizData={quizData}
          onComplete={(answers) => { setQuizAnswers(answers); setScreen("mcq-results"); }} />
      )}
      {screen === "mcq-results" && (
        <QuizSummary answers={quizAnswers} quizData={quizData}
          onRetake={() => setScreen("summary")} />
      )}
    </div>
  );
}