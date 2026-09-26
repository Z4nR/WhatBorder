import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class DisableLogOnSuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Store the original console.log function
    const originalConsoleLog = console.log;

    // Disable console.log if not in development environment
    if (!isDevelopment) {
      console.log = function () {};
    }

    return next.handle().pipe(
      tap({
        complete: () => {
          // Restore console.log if it's not a development environment
          if (!isDevelopment) {
            console.log = originalConsoleLog;
          }
        },
      }),
      catchError((err) => {
        // Restore console.log for error logging
        console.log = originalConsoleLog;

        // Log the error
        console.log('Error occurred:', err);

        // Re-throw the error
        throw err;
      }),
    );
  }
}
