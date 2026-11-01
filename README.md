# Movie Explorer — Module 4

A React + Vite starter that fetches trending and popular movies from TMDB and
displays them in reusable movie rows. It also includes a debounced title search
with loading, error, and no-results states, plus routed movie detail pages with
cast and YouTube trailers. Favorites persist in local storage, and feeds and
search results load more pages as you scroll.

## Requirements

- Node.js 20 or newer
- A free TMDB API key

## Get started

1. Install dependencies:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env` and add your TMDB API key:

   ```env
   VITE_TMDB_API_KEY=your_actual_tmdb_api_key
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

4. Open the local URL printed by Vite.

Vite exposes variables prefixed with `VITE_` to browser code. Do not put a
private server secret in this variable; use a TMDB API key intended for client
applications and restrict it in TMDB settings where available. `.env` is
ignored by Git.

## Modules 1–4 contents

- Vite + React setup and Tailwind CSS
- TMDB API configuration through `import.meta.env`
- Trending this week and popular movie feeds
- Reusable `MovieCard` and `MovieRow` components
- Loading, empty, missing-key, and API error states
- Debounced movie-title search with reusable `useDebounce` and `useMovieSearch` hooks
- React Router routes for home, search, movie details, and not-found pages
- Movie detail, cast, and video data fetched with TMDB's `append_to_response`
- Embedded YouTube trailers when TMDB provides one
- Favorites managed with Context API and persisted in `localStorage`
- Infinite scrolling for feeds and debounced search results, with a manual load-more fallback
- Demo catalog and cinematic responsive home page when no TMDB key is configured
- Vercel SPA rewrite configuration for direct route visits

## Deploy to Vercel

1. Push the project to a Git provider supported by Vercel.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the Vite defaults, or use `npm run build` as the build command and
   `dist` as the output directory; these are also configured in `vercel.json`.
4. In the project's **Settings → Environment Variables**, add
   `VITE_TMDB_API_KEY` with your TMDB API key. Enable it for the environments
   you will use.
5. Deploy or redeploy after adding the environment variable.

The rewrite in `vercel.json` serves the React app for direct visits to routes
such as `/movie/123` and `/favorites`. The TMDB key is included in client-side
requests; do not use a private server credential as a Vite environment variable.
