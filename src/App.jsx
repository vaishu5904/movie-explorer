import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import MovieRow from "./components/MovieRow.jsx";
import { useFavorites } from "./context/FavoritesContext.jsx";
import useInfiniteMovies from "./hooks/useInfiniteMovies.js";
import { demoPopular, demoTrending } from "./data/demoMovies.js";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import MovieDetailPage from "./pages/MovieDetailPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";

const feeds = [
  { title: "This week's buzz", endpoint: "trending/movie/week" },
  { title: "Worth the watch", endpoint: "movie/popular" },
];

function FeedSection({ title, endpoint, id }) {
  const hasApiKey = Boolean(import.meta.env.VITE_TMDB_API_KEY?.trim());
  const { movies, loading, loadingMore, hasMore, error, loadMore } =
    useInfiniteMovies(endpoint, { enabled: hasApiKey });
  const demoMovies = endpoint === "trending/movie/week" ? demoTrending : demoPopular;

  return (
    <MovieRow
      title={title}
      eyebrow={endpoint === "trending/movie/week" ? "What people are watching" : "A few crowd favorites"}
      movies={hasApiKey ? movies : demoMovies}
      id={id}
      loading={hasApiKey && loading}
      loadingMore={hasApiKey && loadingMore}
      hasMore={hasApiKey && hasMore}
      onLoadMore={hasApiKey ? loadMore : undefined}
      error={hasApiKey ? error : ""}
    />
  );
}

function HomePage() {
  const hasApiKey = Boolean(import.meta.env.VITE_TMDB_API_KEY?.trim());

  return (
    <>
      <section className="discovery-hero mt-7 overflow-hidden rounded-[26px] border border-white/[0.08] sm:mt-9">
        <div className="grid min-h-[470px] items-center gap-8 px-6 py-9 sm:px-10 sm:py-12 lg:min-h-[510px] lg:grid-cols-[1fr_0.9fr] lg:gap-4 lg:px-14">
          <div className="relative z-10 max-w-[540px]">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              A better kind of screen time
            </p>
            <h1 className="text-[clamp(2.8rem,5.5vw,4.7rem)] font-semibold leading-[0.99] tracking-[-0.065em]">
              Pick a film.
              <br />
              <span className="hero-heading-accent">Set the mood.</span>
            </h1>
            <p className="mt-6 max-w-[430px] text-sm leading-7 text-zinc-300 sm:text-base">
              Find a new favorite, revisit a classic, or follow the films
              everyone’s talking about. Your next watch starts here.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#trending"
                className="inline-flex min-h-12 items-center gap-4 rounded-xl bg-accent px-5 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:bg-[#ffad91]"
              >
                Browse the buzz <ArrowIcon />
              </a>
              <Link
                to={`/movie/${demoTrending[0].id}`}
                state={{ from: "/" }}
                className="inline-flex min-h-12 items-center gap-3 rounded-xl border border-white/15 bg-white/[0.04] px-5 text-sm font-semibold text-white transition hover:border-accent/45 hover:bg-white/[0.07]"
              >
                <PlayIcon /> Take a chance
              </Link>
            </div>
            <div className="mt-9 flex items-center gap-3 text-xs text-zinc-400">
              <span className="flex -space-x-2">
                {[demoTrending[0], demoTrending[2], demoPopular[0]].map((movie) => (
                  <img
                    key={movie.id}
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                    alt=""
                    className="h-8 w-8 rounded-full border-2 border-[#131622] object-cover"
                  />
                ))}
              </span>
              <span>Stories for every sort of evening</span>
            </div>
          </div>
          <div className="poster-collage relative mx-auto h-[310px] w-full max-w-[430px] sm:h-[360px] lg:h-[390px]">
            <PosterTile movie={demoPopular[0]} className="collage-poster-main left-[27%] top-[4%] z-10 w-[43%] rotate-[3deg]" />
            <PosterTile movie={demoTrending[4]} className="left-[2%] top-[23%] w-[33%] -rotate-[9deg]" />
            <PosterTile movie={demoTrending[5]} className="right-[2%] top-[27%] w-[31%] rotate-[9deg]" />
            <span className="absolute bottom-[5%] left-[12%] rounded-full border border-white/10 bg-[#181b28]/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-300 shadow-lg backdrop-blur">
              Tonight, sorted
            </span>
            <span className="absolute right-[8%] top-[8%] h-16 w-16 rounded-full border border-accent/25 bg-accent/[0.08] blur-[1px]" />
          </div>
        </div>
      </section>

      {!hasApiKey ? <DemoNotice /> : null}

      <div className="space-y-12 pt-10 sm:space-y-16 sm:pt-12">
        {feeds.map((feed) => (
          <FeedSection
            key={feed.endpoint}
            id={feed.endpoint === "trending/movie/week" ? "trending" : undefined}
            {...feed}
          />
        ))}
      </div>

      <section className="watchlist-cta relative mt-14 overflow-hidden rounded-2xl border border-white/[0.09] px-6 py-10 sm:mt-20 sm:px-10 sm:py-12">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            Your shelf, your rules
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            Keep the films you love close.
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-400">
            Build a personal shortlist for the next rainy afternoon, long
            weekend, or spontaneous movie night.
          </p>
          <Link
            to="/favorites"
            className="mt-6 inline-flex min-h-11 items-center gap-3 rounded-lg border border-white/15 bg-white/[0.04] px-4 text-sm font-semibold transition hover:border-accent/50 hover:text-accent"
          >
            Open saved films <ArrowIcon />
          </Link>
        </div>
        <span aria-hidden="true" className="watchlist-spark absolute -right-4 -top-20 text-[280px] leading-none text-accent/[0.04]">
          ◉
        </span>
      </section>
    </>
  );
}

export default function App() {
  const { favorites, error: favoritesError } = useFavorites();

  return (
    <div className="min-h-screen bg-ink text-white">
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#101010]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[76px] max-w-[1440px] flex-wrap items-center justify-between gap-x-7 gap-y-3 px-5 py-3 sm:px-8 lg:px-8">
          <Link className="flex shrink-0 items-center gap-3" to="/" aria-label="Movie Explorer home">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-ink shadow-[0_0_28px_rgba(255,142,114,0.18)]">
              <FilmIcon />
            </span>
            <span className="text-lg font-bold tracking-[-0.045em] sm:text-xl">
              Movie <span className="text-accent">Explorer</span>
            </span>
          </Link>
          <nav aria-label="Main navigation" className="order-3 flex w-full items-center gap-7 sm:order-none sm:w-auto">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `relative flex h-10 items-center text-sm font-semibold transition ${isActive ? "text-white after:absolute after:bottom-[-13px] after:left-0 after:h-[2px] after:w-full after:bg-accent" : "text-zinc-400 hover:text-white"}`
              }
            >
              Explore
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `flex items-center gap-2 text-sm font-semibold transition ${isActive ? "text-white" : "text-zinc-400 hover:text-white"}`
              }
            >
              Saved
              <span className="grid min-w-5 place-items-center rounded-full bg-white/[0.08] px-1.5 py-0.5 text-[11px] text-accent">
                {favorites.length}
              </span>
            </NavLink>
          </nav>
          <HeaderSearch />
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 pb-20 sm:px-8 lg:px-8">
        {favoritesError ? (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-5 py-4 text-sm text-red-200"
          >
            {favoritesError}
          </div>
        ) : null}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/movie/:movieId" element={<MovieDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="border-t border-white/[0.08] px-5 py-8 text-zinc-500">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="w-fit text-sm font-bold tracking-tight text-zinc-300">
            Movie <span className="text-accent">Explorer</span>
          </Link>
          <p className="text-xs">Find something worth watching.</p>
          <span className="text-[9px] font-semibold uppercase tracking-[0.18em]">
            Find a story to take with you.
          </span>
          <span className="text-[10px]">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </span>
        </div>
      </footer>
    </div>
  );
}

function HeaderSearch() {
  const navigate = useNavigate();

  function handleSearch(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = String(formData.get("query") ?? "").trim();
    if (query) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
      event.currentTarget.reset();
    }
  }

  return (
    <form
      role="search"
      onSubmit={handleSearch}
      className="order-4 relative w-full sm:order-none sm:ml-auto sm:w-[260px] lg:w-[310px]"
    >
      <SearchIcon />
      <label className="sr-only" htmlFor="header-search">
        Search movies
      </label>
      <input
        id="header-search"
        name="query"
        type="search"
        placeholder="Search movies..."
        className="h-11 w-full rounded-xl border border-white/[0.09] bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-accent/50 focus:bg-white/[0.06]"
      />
    </form>
  );
}

function DemoNotice() {
  return (
    <div
      role="status"
      className="mt-6 flex flex-wrap items-center gap-x-1.5 gap-y-1 rounded-xl border border-accent/20 bg-accent/[0.045] px-4 py-3 text-xs text-zinc-400 sm:px-5"
    >
      <SparkleIcon />
      <strong className="font-semibold text-zinc-200">Preview catalog</strong>
      <span>· You’re browsing a small sample. Add your TMDB key in</span>
      <code className="font-semibold text-accent">.env</code>
      <span>to unlock the full catalog.</span>
    </div>
  );
}

function FilmIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-[18px] w-[18px]"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 5v14M16 5v14M4 9h4m-4 6h4m8-6h4m-4 6h4" />
    </svg>
  );
}

function PosterTile({ movie, className }) {
  return (
    <Link
      to={`/movie/${movie.id}`}
      state={{ from: "/" }}
      aria-label={`Explore ${movie.title}`}
      className={`collage-poster absolute overflow-hidden rounded-2xl border border-white/15 shadow-2xl ${className}`}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={`${movie.title} poster`}
        className="aspect-[2/3] w-full object-cover"
      />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-3 pb-3 pt-10 text-[11px] font-semibold">
        {movie.title}
      </span>
    </Link>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-zinc-500" stroke="currentColor" strokeWidth="1.7">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
      <path d="M7 4.8v14.4L19 12 7 4.8Z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="mr-1 h-4 w-4 text-accent" stroke="currentColor" strokeWidth="1.7">
      <path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Zm7 13 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </svg>
  );
}
