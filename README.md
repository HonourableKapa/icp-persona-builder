# ICP Persona Builder

A 3-step wizard that generates detailed Ideal Customer Profile (ICP) personas using Claude AI.

## How it works

1. **Product** — describe what you sell
2. **Buyer** — set the industry, job title, and company size
3. **Pain Points** — enter their pain points and goals

Claude generates a structured persona with background, buying triggers, objections, and a messaging hook. You can download the result as JSON.

## Stack

- React + Vite
- Plain CSS
- Anthropic API (`claude-sonnet-4-6`) called directly from the browser

## Local setup

1. Clone the repo
2. Create a `.env` file at the project root:
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-...
   ```
3. Install and run:
   ```bash
   npm install
   npm run dev
   ```

## Deployment

Deploys automatically to GitHub Pages on every push to `main` via GitHub Actions.

Live site: https://honourablekapa.github.io/icp-persona-builder/
