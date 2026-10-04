# Abdulhaq Nikzad — Portfolio

A responsive, frontend-only developer portfolio built with React, TypeScript, and Vite. Profile details and public repositories are read from the GitHub REST API for `Nikzad-314`; saved project details keep the portfolio useful if GitHub's API is unavailable.

## Run locally

1. Install a current Node.js LTS release.
2. Run `npm install`.
3. Run `npm run dev` and open the local URL printed by Vite.
4. Run `npm run build` to create the production site in `dist/`.

## Deploy to Vercel

1. Push this project to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected Vite settings: build command `npm run build`, output directory `dist`.
4. Deploy. No environment variables or backend are required.

The public GitHub API has unauthenticated rate limits. The portfolio has static project fallbacks and requires no API token.

## Customize

- Change the GitHub username and fallback repository details in `src/App.tsx`.
- Update the short introduction, about copy, skills, and contact section in `src/App.tsx` to reflect your current work.
- Adjust colors, responsive layout, and theme styles in `src/App.css` and `src/index.css`.
- Update SEO metadata and page title in `index.html`.
