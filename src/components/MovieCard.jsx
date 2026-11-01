import { Link, useLocation } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext.jsx";
import FavoriteButton from "./FavoriteButton.jsx";
import { getImageUrl } from "../lib/tmdb.js";

export default function MovieCard({ movie }) {
  const location = useLocation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const imageUrl = getImageUrl(movie.poster_path);
  const year = movie.release_date?.slice(0, 4);
  const rating = Number(movie.vote_average);
  const movieLocation = { from: `${location.pathname}${location.search}` };

  return (
    <article className="movie-card group relative min-w-0">
      <Link
        to={`/movie/${movie.id}`}
        state={movieLocation}
        className="movie-card-poster-link block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        aria-label={`View ${movie.title}`}
      >
        <div className="movie-poster relative aspect-[2/3] overflow-hidden rounded-xl bg-panel">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${movie.title} poster`}
              loading="lazy"
              className="movie-poster-image h-full w-full object-cover transition duration-500"
            />
          ) : (
            <div className="grid h-full place-items-center px-4 text-center text-sm text-zinc-500">
              Poster unavailable
            </div>
          )}
          {Number.isFinite(rating) && rating > 0 ? (
            <span className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1 rounded-md bg-black/65 px-2 py-1 text-[10px] font-semibold text-accent backdrop-blur">
              <StarIcon /> {rating.toFixed(1)}
            </span>
          ) : null}
          <span className="movie-card-overlay absolute inset-0 flex items-end bg-gradient-to-t from-black/85 via-black/10 to-transparent p-3 opacity-0 transition-opacity duration-200">
            <span className="rounded-md border border-white/25 bg-black/35 px-2.5 py-1.5 text-[10px] font-semibold text-white backdrop-blur">
              View details <span aria-hidden="true">↗</span>
            </span>
          </span>
        </div>
      </Link>
      <FavoriteButton
        isFavorite={isFavorite(movie.id)}
        onClick={() => toggleFavorite(movie)}
        className="movie-card-favorite absolute right-2 top-2 z-20 h-8 w-8 border-white/20 bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
      />
      <Link
        to={`/movie/${movie.id}`}
        state={movieLocation}
        className="mt-2 block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <h3 className="line-clamp-2 min-h-9 text-[12px] font-semibold leading-[1.35] text-zinc-100 transition group-hover:text-accent">
          {movie.title}
        </h3>
        <div className="mt-1.5 flex items-center justify-between gap-2 text-[10px] text-zinc-500">
          <span>{year || "Release date unknown"}</span>
          {Number.isFinite(rating) && rating > 0 ? (
            <span className="flex items-center gap-1 text-zinc-300">
              <StarIcon /> {rating.toFixed(1)}
            </span>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

function StarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-accent">
      <path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.5 6.3-.9L12 2.8Z" />
    </svg>
  );
}
