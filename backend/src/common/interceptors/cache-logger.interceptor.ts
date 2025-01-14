import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const cacheKey = `${request.method}_${request.url}`;

    console.log(`Cache Key: ${cacheKey}`);

    return next.handle().pipe(
      tap(() => {
        console.log(`Cache operation completed for: ${cacheKey}`);
      }),
    );
  }
}
