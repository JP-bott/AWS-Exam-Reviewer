# AWS Certification Quiz Reviewer

This is a lightweight web app for reviewing AWS certification topics. It uses Node.js + Express to serve a static frontend built with Tailwind CSS and Font Awesome. All quiz questions are stored in `questions.json` and can be updated without changing the app code.

Features
- Load questions dynamically from `questions.json`.
- Display one question at a time with multiple-choice answers.
- Immediate feedback after each selection with icons and colors.
- Final results summary with performance remark and restart without reload.

Getting started

1. Install dependencies:

```powershell
cd "c:\Users\ADMIN\Desktop\AWS\AWS-Exam-Reviewer"
npm install
```

2. Start the app:

```powershell
npm start
```

3. Open your browser to http://localhost:3000

Updating questions

Edit `questions.json` to add/remove questions. Each question must have `question`, `options` (array), `answerIndex` (0-based), and optionally `explanation`.

Example:

```
{
  "id": 5,
  "question": "Sample?",
  "options": ["A","B","C","D"],
  "answerIndex": 0,
  "explanation": "Why A is correct."
}
```

Notes
- Tailwind and Font Awesome are included via CDN for simplicity. For production, consider bundling or self-hosting.
- The server simply serves static files and `questions.json`.
