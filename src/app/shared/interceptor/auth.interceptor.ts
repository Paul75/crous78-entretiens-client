import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ShibbolethService } from '@core/services/shibboleth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const shibbolethService = inject(ShibbolethService);
  const token = shibbolethService.token;

  // Add authentication header if user is authenticated and request is to our API
  if (token && shouldAddAuthHeader(request.url)) {
    const authRequest = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(authRequest);
  }

  return next(request);
};

function shouldAddAuthHeader(url: string): boolean {
  // Add auth header for API requests but not for Shibboleth URLs
  return (
    !url.includes('Shibboleth.sso') && (url.includes('/api/') || url.includes('localhost:3000'))
  );
}
