import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MovieRow from "./MovieRow.jsx";
import useDebounce from "../hooks/useDebounce.js";
import useMovieSearch from "../hooks/useMovieSearch.js";

export default function MovieSearch({ initialQuery = "" }) {
  const [input, setInput] = useState(initialQuery);
  const location = useLocation();
  const navigate = useNavigate();
  const query = useDebounce(input.trim());
  const { movies, loading, loadingMore, hasMore, error, loadMore } =
    useMovieSearch(query);
  const hasInput = input.trim().length > 0;
  const waitingForDebounce = hasInput && input.trim() !== query;

  useEffect(() => {
    setInput(initialQuery);
  }, [initialQuery]);

  function handleSubmit(event) {
    event.preventDefault();
    const searchQuery = input.trim();
    if (searchQuery) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  }

  function handleClear() {
    setInput("");
    if (location.pathname === "/search") {
      navigate("/search", { replace: true });
    }
  }

  return (
    <section aria-label="Search movies" className="mb-12 sm:mb-16">
      <form className="relative max-w-2xl" role="search" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="movie-search">
          Search movies by title
        </label>
        <SearchIcon />
        <input
          id="movie-search"
          type="search"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Search movies by title..."
          autoComplete="off"
          className="h-14 w-full rounded-xl border border-white/10 bg-panel pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-accent/60 focus:ring-2 focus:ring-accent/15"
        />
        {input ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded p-1 text-xs font-medium text-zinc-400 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            aria-label="Clear movie search"
          >
            Clear
          </button>
        ) : null}
      </form>

      <p className="mt-2 text-xs text-zinc-500">
        Search updates when you pause typing.
      </p>

      {hasInput ? (
        <div className="mt-9" aria-live="polite" aria-busy={waitingForDebounce || loading}>
          {waitingForDebounce ? (
            <p className="rounded-xl border border-white/10 px-5 py-6 text-sm text-zinc-400">
              Waiting for you to finish typing…
            </p>
          ) : (
            <MovieRow
              title={`Search results for "${query}"`}
              movies={movies}
              loading={loading}
              loadingMore={loadingMore}
              hasMore={hasMore}
              onLoadMore={loadMore}
              error={error}
              emptyMessage={`No movies found for "${query}". Try another title.`}
            />
          )}
        </div>
      ) : null}
    </section>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4 4" />
    </svg>
  );
}
