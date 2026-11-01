import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "movie-explorer-favorites";
const FavoritesContext = createContext(null);

function readFavorites() {
  let storedValue;
  try {
    storedValue = window.localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    return {
      favorites: [],
      error: `Favorites storage is unavailable: ${error.message}`,
    };
  }

  if (!storedValue) {
    return { favorites: [], error: "" };
  }

  let favorites;
  try {
    favorites = JSON.parse(storedValue);
  } catch {
    return {
      favorites: [],
      error:
        "Saved favorites could not be read. Add a favorite to replace the invalid saved data.",
    };
  }

  if (
    !Array.isArray(favorites) ||
    favorites.some(
      (movie) =>
        !movie ||
        !Number.isSafeInteger(Number(movie.id)) ||
        Number(movie.id) <= 0 ||
        typeof movie.title !== "string",
    )
  ) {
    return {
      favorites: [],
      error:
        "Saved favorites have an invalid format. Add a favorite to replace the invalid saved data.",
    };
  }

  return { favorites, error: "" };
}

export function FavoritesProvider({ children }) {
  const [storedState, setStoredState] = useState(readFavorites);
  const [shouldPersist, setShouldPersist] = useState(false);

  useEffect(() => {
    if (!shouldPersist) {
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(storedState.favorites),
      );
      if (storedState.error) {
        setStoredState((current) => ({ ...current, error: "" }));
      }
    } catch (error) {
      setStoredState((current) => ({
        ...current,
        error: `Favorites could not be saved: ${error.message}`,
      }));
    }
  }, [shouldPersist, storedState.favorites]);

  const toggleFavorite = useCallback((movie) => {
    const savedMovie = {
      id: Number(movie.id),
      title: movie.title,
      poster_path: movie.poster_path ?? null,
      release_date: movie.release_date ?? "",
      vote_average: movie.vote_average ?? 0,
    };
    setStoredState((current) => {
      const alreadySaved = current.favorites.some(
        (favorite) => Number(favorite.id) === savedMovie.id,
      );
      return {
        ...current,
        favorites: alreadySaved
          ? current.favorites.filter(
              (favorite) => Number(favorite.id) !== savedMovie.id,
            )
          : [...current.favorites, savedMovie],
      };
    });
    setShouldPersist(true);
  }, []);

  const value = useMemo(
    () => ({
      favorites: storedState.favorites,
      error: storedState.error,
      isFavorite: (movieId) =>
        storedState.favorites.some(
          (movie) => Number(movie.id) === Number(movieId),
        ),
      toggleFavorite,
    }),
    [storedState, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider.");
  }
  return context;
}
