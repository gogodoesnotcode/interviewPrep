import { useState } from "react";
import { generateDescriptiveQuiz, generateMcqQuiz } from "../api/client";

export default function ResumeSummary({ resumeData, onMcqStart, onDescriptiveStart }) {
  const [generatingMode, setGeneratingMode] = useState(null);
  const [error, setError] = useState(null);

  async function handleMcqStart() {
    setError(null);
    setGeneratingMode("mcq");
    try {
      const quiz = await generateMcqQuiz(resumeData, 12);
      onMcqStart(quiz);
    } catch (err) {
      setError("Couldn't generate questions. Try again.");
    } finally {
      setGeneratingMode(null);
    }
  }

  async function handleDescriptiveStart() {
    setError(null);
    setGeneratingMode("descriptive");
    try {
      const questions = await generateDescriptiveQuiz(resumeData, 8);
      onDescriptiveStart(questions);
    } catch (err) {
      setError("Couldn't generate questions. Try again.");
    } finally {
      setGeneratingMode(null);
    }
  }

  return (
    <div>
      <p className="eyebrow">STEP 2 OF 3</p>
      <h1 className="section-title">
        Here's what we found{resumeData.candidate_name ? `, ${resumeData.candidate_name.split(" ")[0]}` : ""}.
      </h1>
      <p className="hero-sub">
        {resumeData.projects.length} project{resumeData.projects.length === 1 ? "" : "s"} extracted.
        Pick how you want to practice.
      </p>

      <div className="project-list">
        {resumeData.projects.map((project) => (
          <div className="card project-card" key={project.project_name}>
            <h3 className="project-name">{project.project_name}</h3>
            {project.role && <p className="project-role">{project.role}</p>}
            <p className="project-desc">{project.description}</p>
            <div className="chip-row">
              {project.technologies.map((tech) => (
                <span className="chip" key={tech}>{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mode-buttons">
        <button className="btn" onClick={handleMcqStart} disabled={generatingMode !== null}>
          {generatingMode === "mcq" ? "Building your quiz…" : "Practice multiple choice"}
        </button>
        <button className="btn btn-secondary" onClick={handleDescriptiveStart} disabled={generatingMode !== null}>
          {generatingMode === "descriptive" ? "Building your questions…" : "Practice written answers"}
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
