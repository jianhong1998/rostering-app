import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class QueueErrorHandler implements NestInterceptor {
  private logger = new Logger();

  intercept(
    _: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((error) => {
        this.logger.error(error);
        return throwError(() => new Error('Internal Server Error'));
      }),
    );
  }
}
