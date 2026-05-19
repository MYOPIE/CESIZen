import { describe, expect, beforeEach, it, vi } from 'vitest';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService, AuthResponse, UserResponse } from './auth.service';

describe('AuthService', () => {
  const storage = new Map<string, string>();
  const http = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  };

  const currentUser: UserResponse = {
    id: 7,
    email: 'marie.curie@example.com',
    firstName: 'Marie',
    lastName: 'Curie',
    role: 'ROLE_USER',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-02T00:00:00Z'
  };

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => storage.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        storage.set(key, value);
      }),
      removeItem: vi.fn((key: string) => {
        storage.delete(key);
      }),
      clear: vi.fn(() => {
        storage.clear();
      })
    });
    storage.clear();
    vi.clearAllMocks();
  });

  function createService(): AuthService {
    return new AuthService(http as unknown as HttpClient);
  }

  it('rehydrate the user from localStorage', () => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    const service = createService();

    expect(service.currentUserValue).toEqual(currentUser);
  });

  it('logs in and persists the token and user', () => {
    const response: AuthResponse = {
      message: 'OK',
      token: 'jwt-token',
      user: currentUser
    };
    http.post.mockReturnValue(of(response));

    const service = createService();
    service.login({ email: currentUser.email, password: 'Password1' }).subscribe();

    expect(http.post).toHaveBeenCalledWith('http://localhost:8080/api/v1/auth/login', {
      email: currentUser.email,
      password: 'Password1'
    });
    expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(currentUser));
    expect(localStorage.getItem('token')).toBe('jwt-token');
    expect(service.currentUserValue).toEqual(currentUser);
  });

  it('updates the profile and refreshes the current user', () => {
    const updatedUser: UserResponse = {
      ...currentUser,
      firstName: 'Marie-Skłodowska'
    };
    http.put.mockReturnValue(of(updatedUser));

    const service = createService();
    service.updateProfile(currentUser.id, updatedUser).subscribe();

    expect(http.put).toHaveBeenCalledWith(
      `http://localhost:8080/api/v1/users/${currentUser.id}`,
      updatedUser
    );
    expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(updatedUser));
    expect(service.currentUserValue).toEqual(updatedUser);
  });

  it('logs out and clears session data', () => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('token', 'jwt-token');

    const service = createService();
    service.logout();

    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(service.currentUserValue).toBeNull();
  });

  it('exposes the stored token', () => {
    localStorage.setItem('token', 'jwt-token');

    const service = createService();

    expect(service.getToken()).toBe('jwt-token');
  });
});