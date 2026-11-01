import { Link } from "react-router-dom";
import MovieRow from "../components/MovieRow.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <section className="py-12 sm:py-16">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
        Your personal collection
      </p>
      <h1 className="mb-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Your favorites
      </h1>
      <p className="mb-9 text-sm text-zinc-400">
        {favorites.length
          ? `${favorites.length} saved ${favorites.length === 1 ? "movie" : "movies"}`
          : "Save movies here to keep them close."}
      </p>
      {favorites.length ? (
        <MovieRow
          title="Saved movies"
          eyebrow="Kept close"
          movies={favorites}
          loading={false}
          error=""
        />
      ) : (
        <div className="rounded-2xl border border-white/10 bg-panel/60 px-6 py-10 text-center">
          <p className="text-sm text-zinc-400">
            Your list is empty. Browse movies and tap the heart to save one.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-[#e1ff80]"
          >
            Discover movies
          </Link>
        </div>
      )}
    </section>
  );
}
