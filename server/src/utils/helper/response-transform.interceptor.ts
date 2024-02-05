import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { camelCasedKey } from '../camel-cased';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  constructor(private readonly camelCased: camelCasedKey) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.method !== 'GET') {
      return next.handle();
    }
    if (request.method === 'GET') {
      return next.handle().pipe(
        map((data: any) => {
          if (typeof data === 'object') {
            return {
              data: this.camelCased.camelCasedKey(data),
            };
          } else if (typeof data !== 'object') {
            return data;
          }
        }),
      );
    }
  }
}
