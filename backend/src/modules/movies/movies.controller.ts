import { CacheLoggerInterceptor } from '@interceptors/cache-logger.interceptor';
import { TransformInterceptor } from '@interceptors/transform.interceptor';
import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { MovieQueryDto } from './dto/movie-query.dto';
import {
  MovieResponse,
  MoviesListResponse,
} from './interfaces/movie.interface';
import { MoviesService } from './movies.service';

@Controller({
  path: 'movies',
  version: '1',
})
@UseInterceptors(TransformInterceptor, CacheLoggerInterceptor)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('popular')
  async getPopularMovies(
    @Query() query: MovieQueryDto,
  ): Promise<MoviesListResponse> {
    return this.moviesService.getPopularMovies(query);
  }

  @Get('search')
  async searchMovies(
    @Query('query') query: string,
  ): Promise<MoviesListResponse> {
    return this.moviesService.searchMovies(query);
  }

  @Get('trending')
  async getTrendingMovies(): Promise<MoviesListResponse> {
    return this.moviesService.getTrendingMovies();
  }

  @Get('genres')
  async getGenres() {
    return this.moviesService.getGenres();
  }

  @Get(':id')
  async getMovieDetails(@Param('id') id: number): Promise<MovieResponse> {
    return this.moviesService.getMovieDetails(id);
  }

  @Get('genre/:id')
  async getMoviesByGenre(
    @Param('id') genreId: number,
  ): Promise<MoviesListResponse> {
    return this.moviesService.getMoviesByGenre(genreId);
  }
}
