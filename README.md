# AutoApplyPro

A full-stack project for storing resume information and assisting with job-application form filling through a web dashboard and browser extension.

## What this project explores

- Resume and profile management.
- Assisted application-form filling through a Chrome extension.
- AI-assisted cover-letter and job-description workflows.
- Application history, dashboard feedback, and subscription-related UI.

These are project features described by the source and development documentation. This documentation refresh did not verify a live deployment, user counts, application throughput, or production reliability.

## Stack

| Layer | Repository implementation |
| --- | --- |
| Web app | React 18, React Router, Tailwind CSS |
| API | Node.js, Express, MongoDB/Mongoose |
| Authentication integrations | Clerk libraries and JWT-related backend dependencies; review the active route configuration |
| Extension | `autoapply-extension/` |
| Test tooling | Playwright scripts at the root, Jest/Supertest configuration in the backend |

## Local development

Review environment configuration before running the project. From the repository root, `npm run install-all` installs root, backend, and frontend dependencies. `npm run dev` starts both services. `npm run build` builds the frontend. These commands come from the checked-in package scripts; they were not executed as part of this documentation refresh.

Use your own local credentials and development database. Follow [environment setup](ENV_SETUP_INSTRUCTIONS.md) and [local development](LOCAL_DEVELOPMENT_SETUP.md), checking them against the active source because the repository contains notes from several earlier migrations. Do not copy secret values from old notes.

## Start reading here

- [Documentation index](docs/README.md): consolidated navigation for setup, extension, testing, deployment, and historical status notes.
- [Extension packaging](CHROME_WEB_STORE_GUIDE.md).
- [Testing checklist](QA_TESTING_CHECKLIST.md).
- [Deployment instructions](DEPLOYMENT_INSTRUCTIONS.md).

## Repository map

- `frontend/`: pages, shared components, state, and API clients.
- `backend/`: routes, controllers, models, middleware, and integrations.
- `autoapply-extension/`: extension implementation and packaging.
- Root diagnostic scripts: earlier authentication, API, and deployment checks; inspect target URLs before running them.

## Verification and contribution

Use `npm test` for the configured Playwright entry point and the backend's own test script for Jest. Confirm that the expected test files, dependencies, environment variables, and local services exist before interpreting results. No test-pass or deployment-success claim is made by this refresh.

For a portfolio demo, show a complete flow with example data, state the tested environment, and distinguish form assistance from successful submission to external sites.

[Rahul Kashyap](https://github.com/kashyaprahul12659) · [LinkedIn](https://www.linkedin.com/in/kashyaprahul535/)
