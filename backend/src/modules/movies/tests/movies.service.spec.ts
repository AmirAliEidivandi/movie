import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { MoviesService } from '../movies.service';

describe('MoviesService', () => {
  let service: MoviesService;
  let httpService: HttpService;
  let cacheManager: Cache;

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    store: {
      keys: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'tmdb.apiKey') return 'mock-api-key';
      if (key === 'tmdb.apiBaseUrl') return 'https://api.themoviedb.org/3';
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    httpService = module.get<HttpService>(HttpService);
    cacheManager = module.get(CACHE_MANAGER);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getPopularMovies', () => {
    const mockQuery = { page: 1, language: 'en-US' };
    const mockData = { results: [], page: 1, total_pages: 1, total_results: 0 };

    it('should return cached data if available', async () => {
      mockCacheManager.get.mockResolvedValueOnce(mockData);
      const result = await service.getPopularMovies(mockQuery);
      expect(result).toBe(mockData);
      expect(httpService.get).not.toHaveBeenCalled();
    });

    it('should fetch and cache data if not in cache', async () => {
      mockCacheManager.get.mockResolvedValueOnce(null);
      mockHttpService.get.mockReturnValueOnce(of({ data: mockData }));

      const result = await service.getPopularMovies(mockQuery);
      expect(result).toEqual(mockData);
      expect(mockCacheManager.set).toHaveBeenCalled();
    });

    it('should throw HttpException on API error', async () => {
      mockCacheManager.get.mockResolvedValueOnce(null);
      mockHttpService.get.mockReturnValueOnce(throwError(() => new Error()));

      await expect(service.getPopularMovies(mockQuery)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('searchMovies', () => {
    const mockQuery = 'test movie';
    const mockData = { results: [], page: 1, total_pages: 1, total_results: 0 };

    it('should return cached search results if available', async () => {
      mockCacheManager.get.mockResolvedValueOnce(mockData);
      const result = await service.searchMovies(mockQuery);
      expect(result).toBe(mockData);
    });

    it('should fetch and cache search results if not in cache', async () => {
      mockCacheManager.get.mockResolvedValueOnce(null);
      mockHttpService.get.mockReturnValueOnce(of({ data: mockData }));

      const result = await service.searchMovies(mockQuery);
      expect(result).toEqual(mockData);
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        expect.any(String),
        mockData,
        30 * 60 * 1000,
      );
    });
  });

  describe('getMovieDetails', () => {
    const movieId = 123;
    const mockData = { id: movieId, title: 'Test Movie' };

    it('should return cached movie details if available', async () => {
      mockCacheManager.get.mockResolvedValueOnce(mockData);
      const result = await service.getMovieDetails(movieId);
      expect(result).toBe(mockData);
    });

    it('should fetch and cache movie details if not in cache', async () => {
      mockCacheManager.get.mockResolvedValueOnce(null);
      mockHttpService.get.mockReturnValueOnce(of({ data: mockData }));

      const result = await service.getMovieDetails(movieId);
      expect(result).toEqual(mockData);
      expect(mockCacheManager.set).toHaveBeenCalled();
    });
  });

  describe('getTrendingMovies', () => {
    const mockData = { results: [], page: 1, total_pages: 1, total_results: 0 };

    it('should return cached trending movies if available', async () => {
      mockCacheManager.get.mockResolvedValueOnce(mockData);
      const result = await service.getTrendingMovies();
      expect(result).toBe(mockData);
    });

    it('should fetch and cache trending movies if not in cache', async () => {
      mockCacheManager.get.mockResolvedValueOnce(null);
      mockHttpService.get.mockReturnValueOnce(of({ data: mockData }));

      const result = await service.getTrendingMovies();
      expect(result).toEqual(mockData);
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'trending_movies',
        mockData,
        3 * 60 * 60 * 1000,
      );
    });
  });

  describe('cache invalidation', () => {
    it('should invalidate cache by pattern', async () => {
      const mockKeys = ['movie_123', 'movie_456', 'trending_movies'];
      mockCacheManager.store.keys.mockResolvedValueOnce(mockKeys);
      mockCacheManager.del.mockResolvedValue(undefined);

      await service.invalidateCache('movie_');

      expect(mockCacheManager.store.keys).toHaveBeenCalled();
      expect(mockCacheManager.del).toHaveBeenCalledTimes(2);
      expect(mockCacheManager.del).toHaveBeenCalledWith('movie_123');
      expect(mockCacheManager.del).toHaveBeenCalledWith('movie_456');
    });

    it('should invalidate specific movie cache', async () => {
      mockCacheManager.store.keys.mockResolvedValueOnce(['movie_123']);
      mockCacheManager.del.mockResolvedValue(undefined);

      await service.invalidateMovieCache(123);

      expect(mockCacheManager.store.keys).toHaveBeenCalled();
      expect(mockCacheManager.del).toHaveBeenCalledWith('movie_123');
    });
  });

  describe('getPopularMovies edge cases', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should handle empty response data', async () => {
      mockCacheManager.get.mockResolvedValueOnce(null);
      mockHttpService.get.mockReturnValueOnce(
        throwError(() => new Error('Invalid response format')),
      );

      await expect(service.getPopularMovies({ page: 1 })).rejects.toThrow(
        'Failed to fetch popular movies',
      );
    });

    it('should handle invalid page numbers', async () => {
      const mockData = {
        results: [],
        page: 1,
        total_pages: 1,
        total_results: 0,
      };
      mockCacheManager.get.mockResolvedValueOnce(null);
      mockHttpService.get.mockReturnValueOnce(of({ data: mockData }));

      const result = await service.getPopularMovies({ page: -1 });
      expect(result).toEqual(mockData);
    });

    it('should handle cache set failures gracefully', async () => {
      const mockData = {
        results: [],
        page: 1,
        total_pages: 1,
        total_results: 0,
      };
      mockCacheManager.get.mockResolvedValueOnce(null);
      mockCacheManager.set.mockRejectedValueOnce(new Error('Cache error'));
      mockHttpService.get.mockReturnValueOnce(of({ data: mockData }));

      const result = await service.getPopularMovies({ page: 1 });
      expect(result).toEqual(mockData);
    });
  });

  describe('searchMovies edge cases', () => {
    it('should handle empty search query', async () => {
      await expect(service.searchMovies('')).rejects.toThrow(HttpException);
    });

    it('should handle special characters in search query', async () => {
      const specialQuery = '!@#$%^&*()';
      mockCacheManager.get.mockResolvedValueOnce(null);
      mockHttpService.get.mockReturnValueOnce(of({ data: { results: [] } }));

      const result = await service.searchMovies(specialQuery);
      expect(result.results).toEqual([]);
    });

    it('should handle very long search queries', async () => {
      const longQuery = 'a'.repeat(1000);
      mockCacheManager.get.mockResolvedValueOnce(null);
      mockHttpService.get.mockReturnValueOnce(of({ data: { results: [] } }));

      const result = await service.searchMovies(longQuery);
      expect(result.results).toEqual([]);
    });
  });

  describe('getMovieDetails edge cases', () => {
    it('should handle non-existent movie ID', async () => {
      mockCacheManager.get.mockResolvedValueOnce(null);
      mockHttpService.get.mockReturnValueOnce(
        throwError(() => new Error('Not found')),
      );

      await expect(service.getMovieDetails(999999999)).rejects.toThrow(
        HttpException,
      );
    });

    it('should handle invalid movie ID format', async () => {
      await expect(service.getMovieDetails(-1)).rejects.toThrow(HttpException);
    });
  });

  describe('cache management edge cases', () => {
    it('should handle cache get failures', async () => {
      const mockData = {
        results: [],
        page: 1,
        total_pages: 1,
        total_results: 0,
      };
      mockCacheManager.get.mockRejectedValueOnce(new Error('Cache error'));
      mockHttpService.get.mockReturnValueOnce(of({ data: mockData }));

      const result = await service.getPopularMovies({ page: 1 });
      expect(result).toEqual(mockData);
    });

    it('should handle cache invalidation for non-existent keys', async () => {
      mockCacheManager.store.keys.mockResolvedValueOnce([]);
      await service.invalidateCache('non_existent_pattern');
      expect(mockCacheManager.del).not.toHaveBeenCalled();
    });
  });

  describe('error handling edge cases', () => {
    beforeEach(() => {
      // Suppress console.error messages in tests
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should handle malformed API responses', async () => {
      mockCacheManager.get.mockResolvedValueOnce(null);
      mockHttpService.get.mockReturnValueOnce(
        of({ data: { invalid: 'format', results: undefined } }),
      );

      await expect(service.getPopularMovies({ page: 1 })).rejects.toThrow(
        'Failed to fetch popular movies',
      );
    });

    it('should handle rate limit exceeded', async () => {
      mockCacheManager.get.mockResolvedValueOnce(null);
      mockHttpService.get.mockReturnValueOnce(
        throwError(() => ({
          response: { status: 429, statusText: 'Rate limit exceeded' },
        })),
      );

      await expect(service.getPopularMovies({ page: 1 })).rejects.toThrow(
        'Rate limit exceeded',
      );
    });
  });
});
