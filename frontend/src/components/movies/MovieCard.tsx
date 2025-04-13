import { StarIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    posterPath: string | null;
    voteAverage: number;
    releaseDate: string;
  };
  onClick?: () => void;
  isPrimary?: boolean;
  isHovered?: boolean;
}

export function MovieCard({
  movie,
  onClick,
  isPrimary = false,
  isHovered = false,
}: MovieCardProps) {
  const imageUrl = movie.posterPath
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : "/movie-placeholder.jpg";

  const year = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : "";

  // Define variants for animation
  const cardVariants = {
    normal: {
      scale: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    hover: {
      scale: 1.05,
      y: isPrimary ? -10 : -5,
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.2 },
    },
  };

  const imageVariants = {
    normal: {
      scale: 1,
      transition: { duration: 0.5 },
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.5 },
    },
  };

  const overlayVariants = {
    normal: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
    hover: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="relative">
      {/* Rating badge - positioned completely outside the motion div */}
      <div
        className="absolute top-2 right-2 z-30 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md flex items-center shadow-md"
        style={{ transform: "translateZ(0)" }} // Force hardware acceleration
      >
        <StarIcon className="h-3.5 w-3.5 text-yellow-400 mr-1 flex-shrink-0" />
        <span className="text-white text-xs font-medium whitespace-nowrap">
          {movie.voteAverage.toFixed(1)}
        </span>
      </div>

      <motion.div
        variants={cardVariants}
        initial="normal"
        animate={isHovered ? "hover" : "normal"}
        whileTap="tap"
        className="relative cursor-pointer rounded-xl overflow-hidden"
        onClick={onClick}
        style={{
          willChange: "transform",
          transformOrigin: "center bottom",
        }}
      >
        <div
          className={`relative aspect-[2/3] overflow-hidden shadow-xl ${
            isPrimary ? "shadow-indigo-900/20" : ""
          }`}
        >
          <motion.div
            className="w-full h-full rounded-xl overflow-hidden"
            style={{
              willChange: "transform",
              transformStyle: "preserve-3d",
            }}
          >
            <motion.img
              variants={imageVariants}
              initial="normal"
              animate={isHovered ? "hover" : "normal"}
              src={imageUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <motion.div
              variants={overlayVariants}
              initial="normal"
              animate={isHovered ? "hover" : "normal"}
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 rounded-xl"
            >
              <h3
                className={`text-white font-semibold ${
                  isPrimary ? "text-xl" : "text-lg"
                } line-clamp-2 drop-shadow-md`}
              >
                {movie.title}
              </h3>
              <div className="flex items-center mt-2 text-white">
                <StarIcon className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                <span className="ml-1 font-medium">
                  {movie.voteAverage.toFixed(1)}
                </span>
                {year && (
                  <span className="text-gray-300 text-sm ml-4">{year}</span>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
