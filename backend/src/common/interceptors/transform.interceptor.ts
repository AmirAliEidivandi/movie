import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  meta?: {
    page: number;
    total_pages: number;
    total_results: number;
  };
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data?.results) {
          return {
            data: data.results,
            meta: {
              page: data.page,
              total_pages: data.total_pages,
              total_results: data.total_results,
            },
          };
        }
        return { data };
      }),
    );
  }
}
