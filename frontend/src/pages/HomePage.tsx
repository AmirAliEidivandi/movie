import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { movieApi } from "../api/movieApi";
import { MovieSection } from "../components/movies/MovieSection";

interface MovieDisplay {
  id: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  overview: string;
}

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [trendingMovies, setTrendingMovies] = useState<MovieDisplay[]>([]);
  const [popularMovies, setPopularMovies] = useState<MovieDisplay[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<MovieDisplay[]>([]);
  const [searchResults, setSearchResults] = useState<MovieDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage] = useState(1);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const [trending, popular, topRated] = await Promise.all([
          movieApi.getTrending(),
          movieApi.getPopular(currentPage),
          movieApi.getTopRated(),
        ]);

        setTrendingMovies(trending);
        setPopularMovies(popular);
        setTopRatedMovies(topRated);
      } catch (error) {
        console.error("Error fetching movies:", error);
        toast.error(t("Failed to fetch movies. Please try again later."));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage, t]);

  // Banner auto-rotation
  useEffect(() => {
    if (trendingMovies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) =>
        prevIndex === Math.min(4, trendingMovies.length - 1) ? 0 : prevIndex + 1
      );
    }, 7000);

    return () => clearInterval(interval);
  }, [trendingMovies]);

  useEffect(() => {
    const searchMovies = async () => {
      if (searchQuery.trim()) {
        try {
          const results = await movieApi.searchMovies(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error("Error searching movies:", error);
          toast.error(t("Failed to search movies. Please try again."));
        }
      } else {
        setSearchResults([]);
      }
    };

    const debounceTimeout = setTimeout(searchMovies, 500);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, t]);

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  const handleBannerChange = (direction: "next" | "prev") => {
    if (direction === "next") {
      setCurrentBannerIndex((prevIndex) =>
        prevIndex === Math.min(4, trendingMovies.length - 1) ? 0 : prevIndex + 1
      );
    } else {
      setCurrentBannerIndex((prevIndex) =>
        prevIndex === 0 ? Math.min(4, trendingMovies.length - 1) : prevIndex - 1
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-lg font-medium">
            {t("Loading amazing movies for you...")}
          </p>
        </div>
      </div>
    );
  }

  const currentBannerMovie = trendingMovies[currentBannerIndex];
  const heroBackdropUrl = currentBannerMovie?.backdropPath;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="relative h-[70vh] md:h-[80vh] bg-black overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBannerIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            {heroBackdropUrl && (
              <div className="absolute inset-0">
                <img
                  src={
                    heroBackdropUrl
                      ? `https://image.tmdb.org/t/p/original${heroBackdropUrl}`
                      : "/placeholder.jpg"
                  }
                  alt={currentBannerMovie.title}
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />
              </div>
            )}

            <div className="relative h-full flex flex-col items-center justify-center px-4">
              <div className="text-center max-w-4xl mx-auto z-10">
                {currentBannerMovie && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                  >
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-600/80 text-white text-sm font-medium backdrop-blur-sm mb-4">
                      <span className="mr-1">⭐</span>{" "}
                      {currentBannerMovie.voteAverage.toFixed(1)} / 10
                    </span>
                  </motion.div>
                )}

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-lg"
                >
                  {currentBannerMovie
                    ? currentBannerMovie.title
                    : t("Discover Amazing Movies")}
                </motion.h1>

                {currentBannerMovie && currentBannerMovie.overview && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto drop-shadow-md line-clamp-2"
                  >
                    {currentBannerMovie.overview}
                  </motion.p>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-xl mx-auto"
                >
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t("Search for movies...")}
                      className="w-full pl-12 pr-4 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-base shadow-lg"
                    />
                  </div>
                </motion.div>

                {currentBannerMovie && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center mt-10"
                  >
                    <button
                      onClick={() => handleMovieClick(currentBannerMovie.id)}
                      className="btn-primary px-6 py-3 rounded-full flex items-center gap-2 bg-primary-600 hover:bg-primary-700 transition-all"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t("Watch Now")}
                    </button>
                  </motion.div>
                )}

                {/* Banner navigation dots */}
                <div className="flex justify-center gap-2 mt-8">
                  {trendingMovies.slice(0, 5).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentBannerIndex(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        index === currentBannerIndex
                          ? "bg-white scale-110"
                          : "bg-white/30 hover:bg-white/50"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Banner navigation buttons */}
        <button
          onClick={() => handleBannerChange("prev")}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white opacity-70 hover:opacity-100 hover:bg-black/70 transition-all"
          aria-label="Previous banner"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        <button
          onClick={() => handleBannerChange("next")}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white opacity-70 hover:opacity-100 hover:bg-black/70 transition-all"
          aria-label="Next banner"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Movie Details Section */}
      {currentBannerMovie && (
        <div className="container mx-auto px-4 py-10 -mt-16 relative z-20">
          <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl shadow-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Movie Poster */}
              <div className="w-full md:w-1/4 shrink-0">
                <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={
                      currentBannerMovie.posterPath
                        ? `https://image.tmdb.org/t/p/w500${currentBannerMovie.posterPath}`
                        : "/movie-placeholder.jpg"
                    }
                    alt={currentBannerMovie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Movie Details */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {currentBannerMovie.title}
                  </h2>
                  <div className="flex items-center bg-primary-600/90 px-3 py-1 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-yellow-400 mr-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-white font-medium">
                      {currentBannerMovie.voteAverage.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">
                      {t("Release Date")}
                    </h3>
                    <p className="text-white">
                      {new Date(
                        currentBannerMovie.releaseDate
                      ).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">
                      {t("Popularity")}
                    </h3>
                    <p className="text-white">
                      {Math.round(
                        currentBannerMovie.popularity
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">
                      {t("Vote Count")}
                    </h3>
                    <p className="text-white">
                      {currentBannerMovie.voteCount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-gray-400 text-sm mb-2">
                    {t("Overview")}
                  </h3>
                  <p className="text-gray-200 leading-relaxed">
                    {currentBannerMovie.overview || t("No overview available.")}
                  </p>
                </div>

                <button
                  onClick={() => handleMovieClick(currentBannerMovie.id)}
                  className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 bg-primary-600 hover:bg-primary-700 transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("Watch Now")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Sections */}
      <div className="container mx-auto px-4 relative z-10 pb-20">
        {searchQuery.trim() ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MovieSection
              title={t("Search Results")}
              movies={searchResults}
              onMovieClick={handleMovieClick}
            />
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <MovieSection
                title={t("Trending Now")}
                movies={trendingMovies}
                onMovieClick={handleMovieClick}
                isPrimary
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MovieSection
                title={t("Popular Movies")}
                movies={popularMovies}
                onMovieClick={handleMovieClick}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <MovieSection
                title={t("Top Rated")}
                movies={topRatedMovies}
                onMovieClick={handleMovieClick}
              />
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
