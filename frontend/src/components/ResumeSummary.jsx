import { useState } from "react";
import * as api from "../api/client";

export default function ResumeSummary({ resumeData, onMcqStart }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  async function handleMcqStart() {
    setError(null);
    setIsGenerating(true);
    try {
      const quiz = await api.generateMcqQuiz(resumeData, 12);
      onMcqStart(quiz);
    } catch (err) {
      setError(err.message || "Failed to generate questions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px" }}>
      {resumeData.candidate_name && (
        <h2 style={{ marginBottom: 8, color: "#333" }}>
          Welcome, {resumeData.candidate_name}
        </h2>
      )}
      <p style={{ color: "#666", marginBottom: 32 }}>
        {resumeData.projects.length} project{resumeData.projects.length !== 1 ? "s" : ""} found •{" "}
        {resumeData.all_technologies.length} unique technolog{resumeData.all_technologies.length !== 1 ? "ies" : "y"}
      </p>

      <div style={{ marginBottom: 32 }}>
        {resumeData.projects.map((project, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
              backgroundColor: "#fafafa",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0", color: "#333", fontSize: 18 }}>
              {project.project_name}
            </h3>
            {project.role && (
              <p style={{ margin: "0 0 8px 0", color: "#666", fontSize: 13 }}>
                Role: <strong>{project.role}</strong>
              </p>
            )}
            <p style={{ margin: "0 0 12px 0", color: "#555", fontSize: 14, lineHeight: 1.5 }}>
              {project.description}
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {project.technologies.map((tech, tidx) => (
                <span
                  key={tidx}
                  style={{
                    backgroundColor: "#e3f2fd",
                    color: "#1976d2",
                    padding: "4px 12px",
                    borderRadius: 16,
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleMcqStart}
        disabled={isGenerating}
        style={{
          width: "100%",
          padding: "14px 16px",
          backgroundColor: isGenerating ? "#ccc" : "#4caf50",
          color: "white",
          border: "none",
          borderRadius: 4,
          fontSize: 16,
          fontWeight: 600,
          cursor: isGenerating ? "not-allowed" : "pointer",
        }}
      >
        {isGenerating ? "Generating Questions..." : "Practice MCQs"}
      </button>

      {error && (
        <p
          style={{
            color: "#d32f2f",
            marginTop: 16,
            padding: "12px",
            backgroundColor: "#ffebee",
            borderRadius: 4,
            fontSize: 14,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
