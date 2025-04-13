import api from "./axios";

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  video: boolean;
  media_type?: string;
}

export interface MoviesListResponse {
  data: Movie[];
  meta: {
    page: number;
    total_pages: number;
    total_results: number;
  };
}

const formatMovie = (movie: Movie) => ({
  id: movie.id,
  title: movie.title,
  overview: movie.overview,
  posterPath: movie.poster_path,
  backdropPath: movie.backdrop_path,
  releaseDate: movie.release_date,
  voteAverage: movie.vote_average,
  voteCount: movie.vote_count,
  popularity: movie.popularity,
});

export const movieApi = {
  getTrending: async () => {
    try {
      const response = await api.get<MoviesListResponse>("/movies/trending");
      return response.data.data.map(formatMovie);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      return [];
    }
  },

  getPopular: async (page = 1, language = "en-US") => {
    try {
      const response = await api.get<MoviesListResponse>("/movies/popular", {
        params: { page, language },
      });
      return response.data.data.map(formatMovie);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      return [];
    }
  },

  getTopRated: async () => {
    try {
      // Using discover endpoint with sort by vote_average as a workaround
      const response = await api.get<MoviesListResponse>("/movies/discover", {
        params: {
          sort_by: "vote_average.desc",
          "vote_count.gte": 1000, // Minimum vote count to ensure quality
        },
      });
      return response.data.data.map(formatMovie);
    } catch (error) {
      console.error("Error fetching top rated movies:", error);
      return [];
    }
  },

  searchMovies: async (query: string) => {
    try {
      const response = await api.get<MoviesListResponse>("/movies/search", {
        params: { query },
      });
      return response.data.data.map(formatMovie);
    } catch (error) {
      console.error("Error searching movies:", error);
      return [];
    }
  },

  getMoviesByGenre: async (genreId: number) => {
    try {
      const response = await api.get<MoviesListResponse>(
        `/movies/genre/${genreId}`
      );
      return response.data.data.map(formatMovie);
    } catch (error) {
      console.error("Error fetching movies by genre:", error);
      return [];
    }
  },

  getGenres: async () => {
    try {
      const response = await api.get("/movies/genres");
      return response.data;
    } catch (error) {
      console.error("Error fetching genres:", error);
      return { genres: [] };
    }
  },

  getMovieDetails: async (movieId: number) => {
    try {
      const response = await api.get<Movie>(`/movies/${movieId}`);
      return formatMovie(response.data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      throw error;
    }
  },
};
