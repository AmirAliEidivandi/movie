import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_NAME}`,
}));
