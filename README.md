# Resume Interview Prep

Upload your resume, get quizzed on the projects and technologies actually on it. Built to prep for interviews about your own work — the questions you'd expect a real interviewer to ask, not generic trivia.

**🔗 Live: [interviewprep-gjhz.onrender.com](https://interviewprep-gjhz.onrender.com)**

> Hosted on Render's free tier, so the first request after a period of inactivity can take 30–60 seconds while the server wakes up. Everything after that is fast.

---

## What it does

1. Upload a resume (PDF).
2. An agent reads it and extracts the actual projects and technologies mentioned — not education, not skills lists, just what was built and with what.
3. It generates 10–15 multiple-choice interview questions, each tied to a specific project and technology from *your* resume.
4. You take the quiz and get an explanation with every answer, plus a score broken down by project so you know what to review before the interview.

A second mode — write a paragraph answer, get graded against an AI-generated model answer with specific feedback on what you missed — is built into the design but not live yet (see [Roadmap](#roadmap)).

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React (Vite), plain CSS — no UI framework |
| Backend | FastAPI |
| Agent | LangGraph + LangChain, running on [Groq](https://groq.com)'s free-tier API (Llama 3.3) |
| Deployment | Single multi-stage Docker image → [Render](https://render.com) free web service |
| CI | GitHub Actions — lint + test on every push |

Everything runs on free tiers.

## Architecture

```
Browser
  |
  v
+-----------------------------------------------------+
|  Docker container (Render, free tier)                |
|                                                       |
|  FastAPI  ------------->  LangGraph agent             |
|  (serves the React        (resume_graph, mcq_graph)   |
|   build + /api/* routes)                              |
+--------------------------|----------------------------+
                            v
                       Groq API
                 (free-tier LLM calls)
```

One image, one container, one deploy target — the built React app and the API are served from the same FastAPI process for a clean, simple deployment.

## How the agent works

Every LLM step runs through a small [LangGraph](https://langchain-ai.github.io/langgraph/) graph with a validation and retry loop, so a malformed or incomplete generation is automatically caught and retried before it ever reaches you:

- **`resume_graph`** — `parse_resume` (LLM, structured output into a `ResumeExtraction` schema) → `validate_extraction` (confirms the result has real projects and technologies, retries up to twice if not) → returns structured projects + tech.
- **`mcq_graph`** — `generate_mcq` (LLM, structured output into a list of `MCQQuestion`) → `validate_mcq` (confirms question count, exactly 4 options each, spread across multiple projects) → returns the quiz.

Quiz answers are checked instantly in the browser as you go, so there's no lag between picking an answer and seeing whether you got it right.

## Project structure

```
resume-interview-prep/
├── backend/
│   └── app/
│       ├── main.py              # FastAPI app, serves API + built frontend
│       ├── api/routes.py        # /api/resumes/upload, /api/quiz/mcq
│       ├── parsing/             # PDF text extraction (pypdf, no LLM)
│       └── agent/
│           ├── schemas.py       # Pydantic models for every LLM step
│           ├── prompts.py       # system prompts
│           ├── resume_graph.py  # resume parsing graph
│           └── mcq_graph.py     # MCQ generation graph
├── frontend/
│   └── src/
│       ├── App.jsx              # screen router
│       ├── components/          # ResumeUpload, ResumeSummary, MCQQuiz, QuestionCard,  QuizSummary
│       └── styles.css           # design system
├── Dockerfile                   # multi-stage: build React, then run FastAPI
└── .github/workflows/ci.yml
```

## Running it locally

**Backend**
```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add your own GROQ_API_KEY — free at console.groq.com
uvicorn app.main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev             # proxies /api to localhost:8000
```

**Full production container**
```bash
docker build -t resume-interview-prep .
docker run -p 8000:8000 -e GROQ_API_KEY=your_key resume-interview-prep
```

## Design

Cream (`#f2ecdc`) and black (`#1b1b16`), leaning into an "exam paper" motif since the whole point of the tool is interview prep: multiple-choice options render as lettered bubble-sheet options, the question counter reads like a ticket stub (`Q03 / 12`), and every card/button uses a flat offset shadow instead of a blurred one — more stamped stationery than software. Type pairing is Fraunces (headlines) with IBM Plex Sans and IBM Plex Mono (body and structural details).

## Roadmap

- [x] Resume upload → structured project/tech extraction
- [x] MCQ generation and quiz UI, scored client-side
- [x] Dockerized, deployed, CI on push
- [ ] Descriptive Q&A mode — open-ended questions with an AI-generated model answer, graded against the candidate's written response
- [ ] Saved quiz history across sessions
