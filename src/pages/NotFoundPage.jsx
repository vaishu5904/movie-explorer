import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-xl py-20 text-center sm:py-28">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
        404 · Page not found
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        This scene isn’t in the movie.
      </h1>
      <p className="mt-3 text-sm leading-6 text-zinc-400">
        The page may have moved, or the address may be incorrect.
      </p>
      <Link
        to="/"
        className="mt-7 inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-[#e1ff80]"
      >
        Back to discover
      </Link>
    </section>
  );
}
