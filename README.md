# Weather App (React + Vite)

A small React app bootstrapped with Vite. It displays weather information (single-page, component-based) and uses modern React (v19) and Vite dev tooling.

## Quick overview

- Framework: React 19
- Bundler / dev server: Vite
- Linting: ESLint with a few React plugins

This README documents how to set up, run and build the project, lists the main dependencies, and explains the code organization.

## Requirements

- Node.js 18+ (LTS recommended)
- npm (or yarn/pnpm) installed

On Windows PowerShell (default for this workspace) the example commands below will work as-is.

## Setup

1. Install dependencies:

```powershell
npm install
```

2. (Optional) Add a weather API key if the app uses an external weather service. Create a file named `.env` in the project root and add:

```text
VITE_WEATHER_API_KEY=your_api_key_here
```

The app can read this variable via `import.meta.env.VITE_WEATHER_API_KEY` in the code. Do not commit `.env` to source control.

## Running in development

Start the Vite dev server with hot module replacement:

```powershell
npm run dev
```

Open the URL shown in the terminal (typically http://localhost:5173).

## Build and preview production bundle

Create an optimized production build:

```powershell
npm run build
```

Preview the production build locally:

```powershell
npm run preview
```

## Linting

Run ESLint across the project with:

```powershell
npm run lint
```

## Main scripts (from `package.json`)

- `dev` — starts the Vite dev server
- `build` — builds the production bundle
- `preview` — serves the built production bundle for testing
- `lint` — runs ESLint

## External libraries & tools used

This project lists the following notable dependencies (see `package.json` for versions):

- `react` / `react-dom` — UI library
- `vite` — dev server and build tooling
- `@vitejs/plugin-react` — Vite plugin for React (Fast Refresh)
- `eslint`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` — linting and React-focused lint rules
- `@types/react`, `@types/react-dom` — TypeScript type definitions (helpful if TypeScript is added)

These are already configured in `package.json` and used by the project scripts.

## Project structure

Top-level files/folders you will commonly work with:

- `index.html` — Vite entry HTML
- `vite.config.js` — Vite configuration (React plugin, etc.)
- `package.json` — scripts and dependencies
- `src/` — application source
	- `main.jsx` — app entry (mounts React into the DOM)
	- `App.jsx` — root React component
	- `index.css` — global styles
	- `components/` — reusable components
		- `Weather.jsx` — weather component (UI + API fetches)
		- `Weather.css` — styles for the `Weather` component
	- `assets/` — images/static assets
- `public/` — files copied to the build output as-is

Notes on the code organization

- The UI is split into small components kept under `src/components`. The `Weather` component is the primary feature component and handles data fetches, display, and styling scoped in `Weather.css`.
- App-level state (if needed) lives in `App.jsx`. Small apps typically keep state locally in components; for larger state needs consider adding a state manager or React Context.

## Environment & configuration

- Use `VITE_` prefixed variables in a `.env` file for values that must be available to client-side code (for example `VITE_WEATHER_API_KEY`).
- Never store sensitive server-only secrets in client-side env vars. For production, keep private keys on a server or use a serverless proxy.

## Contract (tiny)

- Inputs: environment (Node + npm), optional `VITE_WEATHER_API_KEY` in `.env` for API calls.
- Outputs: a dev server at http://localhost:5173 and a production build in `dist/` after `npm run build`.
- Error modes: missing API key will either show an error in the UI or return empty data depending on the `Weather` component implementation.

## Edge cases to consider

- No network / API failures: the app should show a friendly error or fallback UI (check `Weather.jsx` implementation).
- Missing API key: show placeholder content or an informative message.
- Large results: ensure UI remains responsive and consider pagination or truncation.

## Contributing / next steps

- Add a `.gitignore` entry for `.env` if not already present.
- Add tests (React Testing Library + Vitest) for the `Weather` component.
- Add CI to run `npm run lint` and `npm run build` on pushes/PRs.

---

If you want, I can also:

- add a `.env.example` file and a `.gitignore` entry for `.env`;
- add a short CONTRIBUTING.md or sample test for `Weather.jsx`.

Let me know which follow-up you'd like.
