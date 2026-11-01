import { useSearchParams } from "react-router-dom";
import MovieSearch from "../components/MovieSearch.jsx";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") ?? "";

  return (
    <section className="py-12 sm:py-16">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
        Film finder
      </p>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight sm:text-4xl">
        Search movies
      </h1>
      <MovieSearch initialQuery={query} />
    </section>
  );
}
