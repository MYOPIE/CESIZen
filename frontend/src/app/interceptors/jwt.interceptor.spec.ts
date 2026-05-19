import { describe, expect, it, vi } from 'vitest';
import { HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { jwtInterceptor } from './jwt.interceptor';
import { AuthService } from '../services/auth.service';

describe('jwtInterceptor', () => {
  it('adds the bearer token when one is available', () => {
    const authService = {
      getToken: vi.fn().mockReturnValue('jwt-token')
    };

    let forwardedRequest: HttpRequest<unknown> | undefined;
    const next: HttpHandlerFn = (request) => {
      forwardedRequest = request;
      return of(new HttpResponse({ status: 200 }));
    };

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authService }]
    });

    TestBed.runInInjectionContext(() => {
      jwtInterceptor(new HttpRequest('GET', '/api/v1/users'), next);
    });

    expect(authService.getToken).toHaveBeenCalledTimes(1);
    expect(forwardedRequest?.headers.get('Authorization')).toBe('Bearer jwt-token');
  });

  it('forwards the request unchanged when no token exists', () => {
    const authService = {
      getToken: vi.fn().mockReturnValue(null)
    };

    let forwardedRequest: HttpRequest<unknown> | undefined;
    const next: HttpHandlerFn = (request) => {
      forwardedRequest = request;
      return of(new HttpResponse({ status: 200 }));
    };

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authService }]
    });

    TestBed.runInInjectionContext(() => {
      jwtInterceptor(new HttpRequest('GET', '/api/v1/users'), next);
    });

    expect(forwardedRequest?.headers.has('Authorization')).toBe(false);
  });
});