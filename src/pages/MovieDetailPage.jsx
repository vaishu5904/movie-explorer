import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import FavoriteButton from "../components/FavoriteButton.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { demoPopular, demoTrending } from "../data/demoMovies.js";
import { getImageUrl, getMovieDetails } from "../lib/tmdb.js";

const demoMovies = [...demoTrending, ...demoPopular].filter(
  (movie, index, movies) =>
    movies.findIndex((candidate) => candidate.id === movie.id) === index,
);

export default function MovieDetailPage() {
  const { movieId } = useParams();
  const location = useLocation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [state, setState] = useState({
    movie: null,
    loading: true,
    error: "",
  });
  const numericId = Number(movieId);
  const isValidId =
    /^\d+$/.test(movieId ?? "") &&
    Number.isSafeInteger(numericId) &&
    numericId > 0;
  const hasApiKey = Boolean(import.meta.env.VITE_TMDB_API_KEY?.trim());
  const returnTo = location.state?.from;
  const backPath =
    typeof returnTo === "string" && returnTo.startsWith("/") && !returnTo.startsWith("//")
      ? returnTo
      : "/";

  useEffect(() => {
    if (!isValidId) {
      setState({ movie: null, loading: false, error: "That movie URL is not valid." });
      return undefined;
    }

    if (!hasApiKey) {
      const demoMovie = demoMovies.find((movie) => movie.id === numericId);
      setState({
        movie: demoMovie
          ? {
              ...demoMovie,
              credits: { cast: [] },
              videos: { results: [] },
              genres: [],
              runtime: null,
            }
          : null,
        loading: false,
        error: demoMovie
          ? ""
          : "This title is not in the demo catalog. Add your TMDB API key to browse every movie.",
      });
      return undefined;
    }

    const controller = new AbortController();
    setState({ movie: null, loading: true, error: "" });

    getMovieDetails(movieId, { signal: controller.signal })
      .then((movie) => setState({ movie, loading: false, error: "" }))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setState({ movie: null, loading: false, error: error.message });
        }
      });

    return () => controller.abort();
  }, [movieId, isValidId, hasApiKey]);

  if (state.loading) {
    return (
      <div role="status" className="py-16 text-sm text-zinc-400">
        Loading movie details…
      </div>
    );
  }

  if (state.error || !state.movie) {
    return (
      <section className="py-12 sm:py-16">
        <Link
          to={backPath}
          className="text-sm text-accent transition hover:text-white"
        >
          ← Back to movies
        </Link>
        <div
          role="alert"
          className="mt-8 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-5 py-4 text-sm text-red-200"
        >
          {state.error || "Movie details could not be loaded."}
        </div>
      </section>
    );
  }

  const { movie } = state;
  const backdropUrl = getImageUrl(movie.backdrop_path, "w1280");
  const posterUrl = getImageUrl(movie.poster_path);
  const cast = movie.credits?.cast?.slice(0, 8) ?? [];
  const trailer = chooseTrailer(movie.videos?.results ?? []);
  const year = movie.release_date?.slice(0, 4);
  const rating = Number(movie.vote_average);

  return (
    <article className="pb-12">
      <div className="relative -mx-5 min-h-[300px] overflow-hidden sm:-mx-8 sm:min-h-[420px] lg:-mx-12">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
        <div className="relative mx-auto flex min-h-[300px] max-w-[1440px] items-end px-5 pb-8 sm:min-h-[420px] sm:px-8 sm:pb-12 lg:px-12">
          <div className="max-w-3xl">
            <Link
              to={backPath}
              className="mb-8 inline-flex rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs text-white transition hover:border-accent/70 hover:text-accent"
            >
              ← Back to movies
            </Link>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-zinc-300">
              {year ? <span>{year}</span> : null}
              {movie.runtime ? <span>{formatRuntime(movie.runtime)}</span> : null}
              {Number.isFinite(rating) && rating > 0 ? (
                <span className="font-semibold text-accent">★ {rating.toFixed(1)}</span>
              ) : null}
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
              {movie.title}
            </h1>
            <FavoriteButton
              isFavorite={isFavorite(movie.id)}
              onClick={() => toggleFavorite(movie)}
              className="mt-5 opacity-100"
            />
            {movie.tagline ? (
              <p className="mt-3 text-sm italic text-zinc-300 sm:text-base">
                {movie.tagline}
              </p>
            ) : null}
            {movie.genres?.length ? (
              <p className="mt-4 text-xs text-zinc-400">
                {movie.genres.map((genre) => genre.name).join(" · ")}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
        <div className="space-y-10">
          <section aria-labelledby="overview-heading">
            <h2 id="overview-heading" className="text-xl font-semibold">
              Overview
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-300">
              {movie.overview || "No overview is available for this movie yet."}
            </p>
          </section>

          <section aria-labelledby="cast-heading">
            <h2 id="cast-heading" className="text-xl font-semibold">
              Top cast
            </h2>
            {cast.length ? (
              <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {cast.map((person) => (
                  <li
                    key={person.cast_id ?? `${person.id}-${person.order}`}
                    className="overflow-hidden rounded-xl border border-white/10 bg-panel"
                  >
                    {person.profile_path ? (
                      <img
                        src={getImageUrl(person.profile_path, "w185")}
                        alt=""
                        loading="lazy"
                        className="aspect-[4/5] w-full object-cover"
                      />
                    ) : (
                      <div className="grid aspect-[4/5] place-items-center bg-white/[0.03] text-xs text-zinc-500">
                        No photo
                      </div>
                    )}
                    <div className="p-3">
                      <p className="truncate text-sm font-medium">{person.name}</p>
                      <p className="mt-1 truncate text-xs text-zinc-500">
                        {person.character || "Cast"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-zinc-400">
                {hasApiKey
                  ? "Cast information is not available."
                  : "Add a TMDB API key to load the full cast."}
              </p>
            )}
          </section>
        </div>

        <aside>
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} poster`}
              className="hidden w-full rounded-xl object-cover shadow-2xl lg:block"
            />
          ) : null}
        </aside>
      </div>

      <section aria-labelledby="trailer-heading" className="mt-12">
        <h2 id="trailer-heading" className="text-xl font-semibold">
          Trailer
        </h2>
        {trailer ? (
          <div className="mt-5 aspect-video max-w-4xl overflow-hidden rounded-xl bg-panel">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(trailer.key)}`}
              title={`${movie.title} official trailer`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        ) : (
          <p className="mt-3 text-sm text-zinc-400">
            {hasApiKey
              ? "No trailer is available for this movie."
              : "Add a TMDB API key to load available trailers."}
          </p>
        )}
      </section>
    </article>
  );
}

function chooseTrailer(videos) {
  const youtubeVideos = videos.filter(
    (video) => video.site === "YouTube" && video.key,
  );

  return (
    youtubeVideos.find((video) => video.type === "Trailer" && video.official) ??
    youtubeVideos.find((video) => video.type === "Trailer") ??
    youtubeVideos.find((video) => video.type === "Teaser") ??
    null
  );
}

function formatRuntime(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
}
