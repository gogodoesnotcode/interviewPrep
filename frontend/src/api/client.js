export async function uploadResume(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/resumes/upload", { method: "POST", body: form });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()).resume;
}

export async function generateMcqQuiz(resume, numQuestions = 12) {
  const res = await fetch("/api/quiz/mcq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume, num_questions: numQuestions }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function generateDescriptiveQuiz(resume, numQuestions = 8) {
  const res = await fetch("/api/quiz/descriptive", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume, num_questions: numQuestions }),
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()).questions;
}

export async function evaluateAnswer(question, userAnswer) {
  const res = await fetch("/api/quiz/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, user_answer: userAnswer }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
