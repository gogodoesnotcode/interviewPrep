import { useState } from "react";

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/resumes/upload", { method: "POST", body: form });
    if (!res.ok) {
      setError(await res.text());
      return;
    }
    setResult(await res.json());
  }

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Resume Interview Prep</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit" disabled={!file}>Upload</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
