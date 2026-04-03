# ICP Persona Builder — CLAUDE.md

Project context for Claude Code. Read this before making any changes.

---

## What this project does

A 3-step wizard that collects information about a user's product, target buyer, and pain points, then calls the Anthropic API (Claude) to generate a structured Ideal Customer Profile (ICP) persona. The result is displayed as a formatted card and can be downloaded as JSON.

There is no backend. The Anthropic API is called directly from the browser using the `anthropic-dangerous-direct-browser-access` header. This is intentional for a static deployment.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | React 18 (JSX, hooks only — no class components) |
| Build tool | Vite 8 |
| Styling | Plain CSS in `src/App.css` (no Tailwind, no CSS modules) |
| AI | Anthropic Messages API — model `claude-sonnet-4-6` |
| Deployment | GitLab Pages via `.gitlab-ci.yml` |
| Runtime env | Browser only — no Node server |

No UI component library. No router (single page, step controlled by `useState`). No state management library.

---

## File structure

```
icp-persona-builder/
├── .env                        # local only — never commit (contains API key)
├── .gitignore
├── .gitlab-ci.yml              # CI/CD: build → deploy to GitLab Pages
├── vite.config.js              # base path set to /icp-persona-builder/
├── index.html
├── package.json
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Wizard state machine + step routing
    ├── App.css                 # All styles — single flat file
    ├── api.js                  # Anthropic API call + prompt + JSON parse
    └── components/
        ├── StepProduct.jsx     # Step 0: product/service description
        ├── StepBuyer.jsx       # Step 1: industry, job title, company size
        ├── StepPain.jsx        # Step 2: pain points + goals → triggers generate
        └── PersonaCard.jsx     # Step 3: renders persona + Download JSON button
```

---

## How the wizard works

State lives entirely in `App.jsx`. There is a single `formData` object and a `step` integer (0–3).

```
step 0  StepProduct   → collects: product
step 1  StepBuyer     → collects: industry, jobTitle, companySize
step 2  StepPain      → collects: painPoints, goals → calls generatePersona()
step 3  PersonaCard   → renders persona, offers reset + download
```

The `update` helper does a shallow merge into `formData`:

```js
const update = (fields) => setFormData((prev) => ({ ...prev, ...fields }))
```

Each step component receives `data`, `onChange`, and navigation callbacks (`onNext`, `onBack`, `onGenerate`). Steps do not hold their own state — they are controlled components.

---

## API layer (`src/api.js`)

### Function

```js
export async function generatePersona(formData) → Promise<PersonaObject>
```

### How it works

1. Reads `VITE_ANTHROPIC_API_KEY` from `import.meta.env`. Throws immediately if missing.
2. Builds a prompt that instructs Claude to return **only** a JSON object — no markdown, no explanation.
3. POSTs to `https://api.anthropic.com/v1/messages` with:
   - model: `claude-sonnet-4-6`
   - max_tokens: `1024`
   - the `anthropic-dangerous-direct-browser-access: true` header (required for browser direct access)
4. Extracts the JSON from the response text using `/\{[\s\S]*\}/` — this tolerates any leading/trailing whitespace Claude adds.
5. Returns the parsed object or throws a descriptive error.

### Persona object shape

```ts
{
  name: string
  title: string
  company: string
  industry: string
  companySize: string
  background: string          // 2–3 sentence paragraph
  painPoints: string[]        // 3 items
  goals: string[]             // 3 items
  buyingTriggers: string[]    // 2 items
  objections: string[]        // 2 items
  messagingHook: string       // 1 sentence cold-open
}
```

### Changing the model

The model name is hardcoded in `src/api.js` line 46. Update it there. Do not add a config variable for this — it is intentionally pinned.

### Changing the prompt

The entire prompt is a template literal in `src/api.js` starting at line 13. The JSON schema returned is defined inline in the prompt — if you add or remove fields from the persona, update both the prompt schema and the `PersonaCard` component.

---

## Styling conventions

- All styles are in `src/App.css`. Do not create per-component CSS files.
- CSS variables are inherited from Vite's default `index.css` (`:root` colour tokens).
- Class names are semantic and flat: `.step-card`, `.persona-card`, `.persona-header`, `.two-col`, `.hook-box`, `.actions`, `.error`.
- No BEM, no CSS modules, no utility classes.
- Responsive breakpoint: `max-width: 540px` for the two-column grid collapse.

---

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `VITE_ANTHROPIC_API_KEY` | Yes | Anthropic API key — browser-exposed via `import.meta.env` |

Create a `.env` file at the project root:

```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

The `.env` file is listed in `.gitignore` and must never be committed. The API key is visible in the browser network tab — this is acceptable for a local/demo tool but not for a public production deployment.

---

## Local development

```bash
npm install
npm run dev       # starts Vite dev server at http://localhost:5173/icp-persona-builder/
```

Build for production:

```bash
npm run build     # outputs to dist/
```

Preview the production build locally:

```bash
npm run preview
```

---

## Deployment — GitLab Pages

The `.gitlab-ci.yml` has two stages that only run on `main`:

1. **build** — runs `npm ci && npm run build`, saves `dist/` as an artifact.
2. **pages** — copies `dist/` to `public/` (GitLab Pages serves from `public/`).

The `vite.config.js` sets `base: '/icp-persona-builder/'` so all asset paths match the GitLab Pages URL:

```
https://<namespace>.gitlab.io/icp-persona-builder/
```

If the repo name or GitLab namespace changes, update `base` in `vite.config.js` to match.

The API key must be added as a **masked CI/CD variable** in GitLab (`Settings → CI/CD → Variables`) named `VITE_ANTHROPIC_API_KEY` — it is injected at build time by Vite.

---

## What not to do

- Do not add a backend/proxy unless the security model changes (the current direct-browser approach is intentional).
- Do not split `App.css` into component-level files — keep styles co-located in one place.
- Do not add a router — the step integer is the only navigation state needed.
- Do not add a state management library — the `formData` + `step` pattern in `App.jsx` is sufficient.
- Do not commit `.env`.
