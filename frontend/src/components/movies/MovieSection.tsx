import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useRef, useState } from "react";
import { MovieCard } from "./MovieCard";

interface Movie {
  id: number;
  title: string;
  posterPath: string | null;
  voteAverage: number;
  releaseDate: string;
}

interface MovieSectionProps {
  title: string;
  movies: Movie[] | null | undefined;
  onMovieClick?: (movieId: number) => void;
  isPrimary?: boolean;
}

export function MovieSection({
  title,
  movies,
  onMovieClick,
  isPrimary = false,
}: MovieSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // If movies is null/undefined or empty, show a message
  if (!movies || movies.length === 0) {
    return (
      <div className="py-8">
        <h2
          className={`text-2xl font-bold mb-4 text-white ${
            isPrimary ? "text-3xl" : ""
          }`}
        >
          {title}
        </h2>
        <p className="text-gray-400">No movies available</p>
      </div>
    );
  }

  return (
    <div className={`relative py-8 ${isPrimary ? "mb-10" : "mb-6"}`}>
      <h2
        className={`text-2xl font-bold mb-6 text-white ${
          isPrimary ? "text-3xl md:text-4xl" : ""
        }`}
      >
        {title}
        {isPrimary && (
          <div className="h-1 w-20 bg-indigo-500 mt-2 rounded-full"></div>
        )}
      </h2>

      <div className="relative group">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-1/2 hover:bg-indigo-600 hover:scale-110 transition-transform"
          aria-label="Scroll left"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-none scroll-smooth pb-8 pt-2"
          style={{ overflow: "auto", WebkitOverflowScrolling: "touch" }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className={`flex-none ${
                isPrimary ? "w-60 md:w-72" : "w-48 md:w-60"
              }`}
              onMouseEnter={() => setHoveredCardId(movie.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              style={{ position: "relative" }}
            >
              <MovieCard
                movie={{
                  ...movie,
                  posterPath: movie.posterPath || "/movie-placeholder.jpg",
                }}
                onClick={() => onMovieClick?.(movie.id)}
                isPrimary={isPrimary}
                isHovered={hoveredCardId === movie.id}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-1/2 hover:bg-indigo-600 hover:scale-110 transition-transform"
          aria-label="Scroll right"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
