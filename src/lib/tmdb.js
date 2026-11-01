const API_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export function getImageUrl(path, size = "w500") {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}

async function requestTmdb(endpoint, { signal, params = {} } = {}) {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Add VITE_TMDB_API_KEY to your .env file and restart Vite.");
  }

  const url = new URL(`${API_BASE_URL}/${endpoint}`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("language", "en-US");
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(
      `TMDB couldn't load ${endpoint.replaceAll("/", " ")} (HTTP ${response.status}). Check your API key and try again.`,
    );
  }

  return response.json();
}

export async function getMoviePage(endpoint, { signal, query, page = 1 } = {}) {
  const params = { page: String(page) };
  if (query) {
    params.query = query;
  }

  const data = await requestTmdb(endpoint, { signal, params });
  if (
    !Array.isArray(data.results) ||
    !Number.isInteger(data.page) ||
    !Number.isInteger(data.total_pages) ||
    data.page !== page ||
    data.total_pages < 0
  ) {
    throw new Error("TMDB returned an unexpected response. Please try again.");
  }

  return {
    movies: data.results,
    page: data.page,
    totalPages: data.total_pages,
  };
}

export async function getMovieDetails(movieId, { signal } = {}) {
  const data = await requestTmdb(`movie/${movieId}`, {
    signal,
    params: { append_to_response: "credits,videos" },
  });

  if (!data || typeof data !== "object" || !data.id || !data.title) {
    throw new Error("TMDB returned unexpected movie details. Please try again.");
  }

  return data;
}
