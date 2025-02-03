import { AuthModule } from '@auth/auth.module';
import databaseConfig from '@config/database.config';
import { HealthController } from '@health/health.controller';
import { MoviesModule } from '@movies/movies.module';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from '@users/users.module';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [databaseConfig],
      envFilePath: `.env.${process.env.NODE_ENV || 'local'}`,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 60 * 1000, // 1 hour
      max: 100, // maximum number of items in cache
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.get<number>('THROTTLE_TTL'),
            limit: configService.get<number>('THROTTLE_LIMIT'),
          },
        ],
      }),
    }),
    I18nModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get('FALLBACK_LANGUAGE'),
        loaderOptions: {
          path: path.join(process.cwd(), 'src/i18n/'),
          watch: true,
        },
        resolvers: [new HeaderResolver(['x-custom-lang'])],
        typesOutputPath: path.join(
          process.cwd(),
          'src/generated/i18n.generated.ts',
        ),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get('database'),
      inject: [ConfigService],
    }),
    TerminusModule,
    HttpModule,
    AuthModule,
    UsersModule,
    MoviesModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
