import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const addTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  if (auth.is_logged_in()) {
    const reqWithToken = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${auth.state$().jwt}`),
    });
    return next(reqWithToken);
  } else {
    return next(req);
  }
};
