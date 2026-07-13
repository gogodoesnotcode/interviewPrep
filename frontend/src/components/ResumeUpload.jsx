import { useState } from "react";
import { uploadResume } from "../api/client";

export default function ResumeUpload({ onParsed }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;
    setError(null);
    setIsUploading(true);
    try {
      const resume = await uploadResume(file);
      onParsed(resume);
    } catch (err) {
      setError("Couldn't read that resume. Try a different PDF.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      <p className="eyebrow">UPLOAD &rarr; PARSE &rarr; PRACTICE</p>
      <h1 className="hero-title">Know your own resume.</h1>
      <p className="hero-sub">
        Upload your resume and this turns the projects on it into interview
        questions &mdash; multiple choice today, written answers coming soon.
        No sign-up, nothing saved.
      </p>

      <form className="card upload-card" onSubmit={handleSubmit}>
        <label className="dropzone" htmlFor="resume-file">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="dropzone-icon">
            <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="dropzone-text">
            {file ? file.name : "Click to choose a PDF resume"}
          </span>
        </label>
        <input
          id="resume-file"
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          hidden
        />

        <button className="btn" type="submit" disabled={!file || isUploading}>
          {isUploading ? "Reading your resume…" : "Upload & analyze"}
        </button>

        {isUploading && (
          <p className="hint">
            First request can take up to a minute on a cold server &mdash; hang tight.
          </p>
        )}
        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
}
