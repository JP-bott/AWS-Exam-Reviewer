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
npm install
```

2. Start the app:

```powershell
npm start
```

3. Open your browser to http://localhost:3000

Updating questions
 
## CI / CD

CI/CD for this project is handled with GitHub Actions. On every push and pull request the workflow installs dependencies (`npm ci`) and runs the test suite (`npm test`). When changes are merged into `main` and tests pass, the site is built (if a build step exists) and deployed (for example to GitHub Pages or another static host). If tests fail, deployment is blocked.

To reproduce what CI runs, run locally:

```powershell
npm ci
npm test
```

If you want the exact workflow file or a deployment target configured, add a `.github/workflows/ci.yml` and a deploy step for your chosen host.
```

- Install and run a full install like the CI would:

```powershell
npm ci
npm test
# optional: npm run build
```

Assumptions made in this README
- The project is hosted on GitHub and uses GitHub Actions for CI/CD. If you use another CI provider (GitLab CI, CircleCI, etc.) the high-level steps are equivalent but the configuration differs.
- There is a `test` script in `package.json` (the repo already contains `__tests__`); if you add linters or type checks, add them to the CI workflow as extra steps.

Next steps / improvements
- Add a concrete workflow file under `.github/workflows/ci.yml` that matches your preferred deployment target.
- Add badges (build / coverage) to the top of this README once the pipeline is in place.
