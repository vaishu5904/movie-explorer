import MovieCard from "./MovieCard.jsx";
import useInfiniteScroll from "../hooks/useInfiniteScroll.js";

const noop = () => {};

export default function MovieRow({
  title,
  movies,
  loading,
  error,
  emptyMessage = "No movies were returned. Please try again later.",
  hasMore = false,
  loadingMore = false,
  onLoadMore,
  eyebrow = "Movie collection",
  id,
}) {
  const loadMoreRef = useInfiniteScroll(
    onLoadMore ?? noop,
    hasMore && !loading && !loadingMore && !error,
  );

  return (
    <section id={id} aria-label={title} className="scroll-mt-28">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-accent/80">
            {eyebrow}
          </p>
          <h2 className="text-[22px] font-semibold tracking-[-0.045em] sm:text-[26px]">{title}</h2>
        </div>
        {hasMore ? (
          <span className="hidden items-center gap-2 pb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500 sm:flex">
            Scroll to explore <ArrowDownIcon />
          </span>
        ) : null}
        {!loading && !error && movies.length > 0 ? (
          <span className="pb-1 text-xs text-zinc-500">{movies.length} titles</span>
        ) : null}
      </div>

      {loading ? (
        <div
          aria-label={`Loading ${title.toLowerCase()}`}
          className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-5 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[2/3] rounded-xl bg-panel" />
              <div className="mt-3 h-3 w-3/4 rounded bg-panel" />
              <div className="mt-2 h-3 w-1/3 rounded bg-panel" />
            </div>
          ))}
        </div>
      ) : error && movies.length === 0 ? (
        <div className="space-y-4">
          <div
            role="alert"
            className="rounded-xl border border-red-400/20 bg-red-400/[0.06] px-5 py-4 text-sm text-red-200"
          >
            {error}
          </div>
          {hasMore && onLoadMore ? (
            <button
              type="button"
              onClick={onLoadMore}
              className="rounded-lg border border-white/15 px-4 py-2 text-sm text-zinc-200 transition hover:border-accent/60 hover:text-accent"
            >
              Try again
            </button>
          ) : null}
        </div>
      ) : movies.length === 0 ? (
        <p className="rounded-xl border border-white/10 px-5 py-8 text-sm text-zinc-400">
          {emptyMessage}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-5 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
      {!loading && movies.length > 0 && hasMore ? (
        <div ref={loadMoreRef} className="flex min-h-16 justify-center pt-6">
          {loadingMore ? (
            <p role="status" className="py-2 text-sm text-zinc-400">
              Loading more movies…
            </p>
          ) : (
            <button
              type="button"
              onClick={onLoadMore}
              className="rounded-lg border border-white/15 px-4 py-2 text-sm text-zinc-200 transition hover:border-accent/60 hover:text-accent"
            >
              Load more
            </button>
          )}
        </div>
      ) : null}
      {!loading && movies.length > 0 && error ? (
        <div className="mt-5 space-y-3">
          <div
            role="alert"
            className="rounded-xl border border-red-400/20 bg-red-400/[0.06] px-5 py-4 text-sm text-red-200"
          >
            {error}
          </div>
          <button
            type="button"
            onClick={onLoadMore}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-zinc-200 transition hover:border-accent/60 hover:text-accent"
          >
            Try loading more
          </button>
        </div>
      ) : null}
    </section>
  );
}

function ArrowDownIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 5v14m-6-6 6 6 6-6" />
    </svg>
  );
}
