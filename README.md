# Pixel Perfect Pix

Implement exactly the screenshot and nothing else

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2ede79c5-5d50-47a7-9a1d-35bbda717622).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

The app is a plain Vite + React single-page app with React Router (`/`, `/sign-in`, `/sign-up`, `/app`).

## Deploying to Vercel

`npm run build` writes a static site to `dist/`. `vercel.json` rewrites every path that is not a file to `index.html`, so deep links such as `/app` load the SPA and React Router takes over.

Set these environment variables in the Vercel project (they are inlined at build time):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
