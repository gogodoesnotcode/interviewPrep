import { useState } from "react";
import * as api from "../api/client";

export default function ResumeUpload({ onParsed }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsUploading(true);
    try {
      const resume = await api.uploadResume(file);
      onParsed(resume);
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "40px 20px" }}>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 30 }}>
        Upload your resume (PDF) to get started. Processing may take up to 60 seconds on first request.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          style={{
            display: "block",
            marginBottom: 16,
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: 4,
            width: "100%",
            boxSizing: "border-box",
          }}
        />
        <button
          type="submit"
          disabled={!file || isUploading}
          style={{
            width: "100%",
            padding: "12px 16px",
            backgroundColor: file && !isUploading ? "#0066cc" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: 4,
            fontSize: 16,
            fontWeight: 500,
            cursor: file && !isUploading ? "pointer" : "not-allowed",
          }}
        >
          {isUploading ? "Uploading..." : "Upload Resume"}
        </button>
      </form>
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
