import { registerAs } from '@nestjs/config';

export default registerAs('tmdb', () => ({
  apiKey: process.env.TMDB_API_KEY,
  apiBaseUrl: process.env.TMDB_API_BASE_URL,
  imageBaseUrl: process.env.TMDB_IMAGE_BASE_URL,
}));
