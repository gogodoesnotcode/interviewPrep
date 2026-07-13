import { useState } from "react";
import { generateMcqQuiz } from "../api/client";

export default function ResumeSummary({ resumeData, onMcqStart }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  async function handleMcqStart() {
    setError(null);
    setIsGenerating(true);
    try {
      const quiz = await generateMcqQuiz(resumeData, 12);
      onMcqStart(quiz);
    } catch (err) {
      setError("Couldn't generate questions. Try again.");
    } finally {
      setIsGenerating(false);
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
        <button className="btn" onClick={handleMcqStart} disabled={isGenerating}>
          {isGenerating ? "Building your quiz…" : "Practice multiple choice"}
        </button>
        <button className="btn btn-secondary" disabled title="Coming soon">
          Practice written answers &mdash; soon
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
