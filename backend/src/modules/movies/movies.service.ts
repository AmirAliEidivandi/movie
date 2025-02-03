import { LoggerService } from '@logger/logger.service';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { CACHE_CONFIG } from './cache/cache.config';
import { MovieQueryDto } from './dto/movie-query.dto';
import {
  MovieResponse,
  MoviesListResponse,
} from './interfaces/movie.interface';

@Injectable()
export class MoviesService {
  private readonly apiKey: string;
  private readonly apiBaseUrl: string;
  private readonly cachePrefix: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly logger: LoggerService,
  ) {
    this.apiKey = this.configService.get<string>('tmdb.apiKey');
    this.apiBaseUrl = this.configService.get<string>('tmdb.apiBaseUrl');
    this.cachePrefix = CACHE_CONFIG.prefix;
  }

  private getCacheKey<T extends keyof typeof CACHE_CONFIG.keys>(
    type: T,
    ...args: any[]
  ): string {
    const keyGenerator = CACHE_CONFIG.keys[type] as (...args: any[]) => string;
    return `${this.cachePrefix}${keyGenerator(...args)}`;
  }

  private async cacheGet<T>(key: string): Promise<T | null> {
    try {
      return await this.cacheManager.get<T>(key);
    } catch (error) {
      this.logger.error(
        `Cache get error for key ${key}:`,
        error.stack,
        'Cache',
      );
      return null;
    }
  }

  private async cacheSet(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
    } catch (error) {
      this.logger.error(
        `Cache set error for key ${key}:`,
        error.stack,
        'Cache',
      );
    }
  }

  async getPopularMovies(query: MovieQueryDto): Promise<MoviesListResponse> {
    const cacheKey = this.getCacheKey('popular', query.page, query.language);
    const cachedData = await this.cacheGet<MoviesListResponse>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await this.httpService
        .get<MoviesListResponse>(`${this.apiBaseUrl}/movie/popular`, {
          params: {
            api_key: this.apiKey,
            page: query.page,
            language: query.language,
          },
        })
        .toPromise();

      await this.cacheSet(cacheKey, response.data, CACHE_CONFIG.ttl.popular);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch popular movies',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchMovies(query: string): Promise<MoviesListResponse> {
    const cacheKey = this.getCacheKey('search', query);
    const cachedData = await this.cacheGet<MoviesListResponse>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await this.httpService
        .get<MoviesListResponse>(`${this.apiBaseUrl}/search/movie`, {
          params: { api_key: this.apiKey, query },
        })
        .toPromise();

      await this.cacheSet(cacheKey, response.data, CACHE_CONFIG.ttl.search);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to search movies',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMovieDetails(movieId: number): Promise<MovieResponse> {
    const cacheKey = this.getCacheKey('details', movieId);
    const cachedData = await this.cacheGet<MovieResponse>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await this.httpService
        .get<MovieResponse>(`${this.apiBaseUrl}/movie/${movieId}`, {
          params: { api_key: this.apiKey },
        })
        .toPromise();

      await this.cacheSet(cacheKey, response.data, CACHE_CONFIG.ttl.details);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch movie details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTrendingMovies(): Promise<MoviesListResponse> {
    const cacheKey = this.getCacheKey('trending');
    const cachedData = await this.cacheGet<MoviesListResponse>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await this.httpService
        .get<MoviesListResponse>(`${this.apiBaseUrl}/trending/movie/week`, {
          params: { api_key: this.apiKey },
        })
        .toPromise();

      await this.cacheSet(cacheKey, response.data, CACHE_CONFIG.ttl.trending);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch trending movies',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMoviesByGenre(genreId: number): Promise<MoviesListResponse> {
    if (genreId < 1) {
      throw new HttpException('Invalid genre ID', HttpStatus.BAD_REQUEST);
    }

    const cacheKey = this.getCacheKey('genres', genreId);
    const cachedData = await this.cacheGet<MoviesListResponse>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await this.httpService
        .get<MoviesListResponse>(`${this.apiBaseUrl}/discover/movie`, {
          params: {
            api_key: this.apiKey,
            with_genres: genreId,
          },
        })
        .toPromise();

      await this.cacheSet(cacheKey, response.data, CACHE_CONFIG.ttl.genres);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch movies by genre',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getGenres() {
    const cacheKey = this.getCacheKey('genres');
    const cachedData = await this.cacheGet(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await this.httpService
        .get(`${this.apiBaseUrl}/genre/movie/list`, {
          params: { api_key: this.apiKey },
        })
        .toPromise();

      await this.cacheSet(cacheKey, response.data, CACHE_CONFIG.ttl.genres);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch genres',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async invalidateCache(pattern: string): Promise<void> {
    const store = this.cacheManager.stores[0] as any;
    const keys = (await store.store.opts.store.keys('*')) || [];
    const matchingKeys = keys.filter((key) => key.includes(pattern));

    await Promise.all(matchingKeys.map((key) => this.cacheManager.del(key)));
  }

  async invalidateMovieCache(movieId: number): Promise<void> {
    await this.invalidateCache(`movie_${movieId}`);
  }

  async invalidatePopularMoviesCache(): Promise<void> {
    await this.invalidateCache('popular_movies');
  }

  async invalidateTrendingMoviesCache(): Promise<void> {
    await this.invalidateCache('trending_movies');
  }
}
