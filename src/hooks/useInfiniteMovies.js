import { useCallback, useEffect, useRef, useState } from "react";
import { getMoviePage } from "../lib/tmdb.js";

const initialState = {
  movies: [],
  loading: false,
  loadingMore: false,
  hasMore: false,
  error: "",
};

export default function useInfiniteMovies(
  endpoint,
  { query = "", enabled = true } = {},
) {
  const [state, setState] = useState(initialState);
  const generationRef = useRef(0);
  const pageRef = useRef(0);
  const totalPagesRef = useRef(1);
  const requestPendingRef = useRef(false);
  const controllerRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (
      !enabled ||
      requestPendingRef.current ||
      pageRef.current >= totalPagesRef.current
    ) {
      return;
    }

    requestPendingRef.current = true;
    const generation = generationRef.current;
    const page = pageRef.current + 1;
    const controller = new AbortController();
    controllerRef.current = controller;
    setState((current) => ({
      ...current,
      loading: page === 1,
      loadingMore: page > 1,
      error: "",
    }));

    try {
      const result = await getMoviePage(endpoint, {
        signal: controller.signal,
        query,
        page,
      });
      if (generation !== generationRef.current) {
        return;
      }

      pageRef.current = result.page;
      totalPagesRef.current = Math.min(result.totalPages, 500);
      setState((current) => {
        const seenIds = new Set(
          page === 1 ? [] : current.movies.map((movie) => movie.id),
        );
        const nextMovies =
          page === 1
            ? result.movies
            : [
                ...current.movies,
                ...result.movies.filter((movie) => !seenIds.has(movie.id)),
              ];

        return {
          movies: nextMovies,
          loading: false,
          loadingMore: false,
          hasMore: result.page < totalPagesRef.current,
          error: "",
        };
      });
    } catch (error) {
      if (generation === generationRef.current && error.name !== "AbortError") {
        setState((current) => ({
          ...current,
          loading: false,
          loadingMore: false,
          error: error.message,
        }));
      }
    } finally {
      if (generation === generationRef.current) {
        requestPendingRef.current = false;
        controllerRef.current = null;
      }
    }
  }, [enabled, endpoint, query]);

  useEffect(() => {
    generationRef.current += 1;
    controllerRef.current?.abort();
    requestPendingRef.current = false;
    pageRef.current = 0;
    totalPagesRef.current = 1;
    setState({
      ...initialState,
      loading: enabled,
      hasMore: enabled,
    });

    if (enabled) {
      loadMore();
    }

    return () => {
      generationRef.current += 1;
      controllerRef.current?.abort();
      requestPendingRef.current = false;
    };
  }, [enabled, endpoint, query, loadMore]);

  return { ...state, loadMore };
}
