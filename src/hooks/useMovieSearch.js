import useInfiniteMovies from "./useInfiniteMovies.js";
import { demoPopular, demoTrending } from "../data/demoMovies.js";

export default function useMovieSearch(query) {
  const hasApiKey = Boolean(import.meta.env.VITE_TMDB_API_KEY?.trim());
  const search = useInfiniteMovies("search/movie", {
    query,
    enabled: hasApiKey && Boolean(query),
  });

  if (hasApiKey) {
    return search;
  }

  const demoMovies = [...demoTrending, ...demoPopular].filter(
    (movie, index, movies) =>
      movies.findIndex((candidate) => candidate.id === movie.id) === index,
  );
  const normalizedQuery = query.toLocaleLowerCase();
  const results = normalizedQuery
    ? demoMovies.filter((movie) =>
        movie.title.toLocaleLowerCase().includes(normalizedQuery),
      )
    : [];

  return {
    movies: results,
    loading: false,
    loadingMore: false,
    hasMore: false,
    error: "",
    loadMore: () => {},
  };
}
