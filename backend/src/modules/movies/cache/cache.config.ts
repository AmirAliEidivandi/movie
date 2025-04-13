export const CACHE_CONFIG = {
  prefix: 'movies_api_v1_',
  ttl: {
    popular: 30 * 60 * 1000, // 30 minutes
    trending: 3 * 60 * 60 * 1000, // 3 hours
    details: 24 * 60 * 60 * 1000, // 24 hours
    search: 15 * 60 * 1000, // 15 minutes
    genres: 7 * 24 * 60 * 60 * 1000, // 1 week
    discover: 30 * 60 * 1000, // 30 minutes
  },
  keys: {
    popular: (page: number, lang: string): string => `popular_${page}_${lang}`,
    trending: (): string => 'trending',
    details: (id: number): string => `movie_${id}`,
    search: (query: string): string => `search_${query}`,
    genres: (): string => 'genres',
    discover: (sortBy: string, minVoteCount: number): string =>
      `discover_${sortBy}_${minVoteCount}`,
  },
} as const;
