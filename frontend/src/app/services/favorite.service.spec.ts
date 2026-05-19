import { describe, expect, beforeEach, it, vi } from 'vitest';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FavoriteService } from './favorite.service';
import { AuthService, UserResponse } from './auth.service';

describe('FavoriteService', () => {
  const http = { post: vi.fn(), delete: vi.fn() };
  const fakeUser: UserResponse = { id: 42, email: 'u@x.com', firstName: 'U', lastName: 'X', role: 'ROLE_USER', isActive: true, createdAt: '', updatedAt: '' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createService(auth?: Partial<AuthService>): FavoriteService {
    const authMock = (auth ?? { currentUserValue: fakeUser }) as AuthService;
    return new FavoriteService(http as unknown as HttpClient, authMock);
  }

  it('adds and removes favorite activity', () => {
    http.post.mockReturnValue(of(undefined));
    http.delete.mockReturnValue(of(undefined));

    const service = createService();
    service.addFavoriteActivity(7).subscribe();
    expect(http.post).toHaveBeenCalledWith('/api/favorites/users/42/activities/7', {});

    service.removeFavoriteActivity(7).subscribe();
    expect(http.delete).toHaveBeenCalledWith('/api/favorites/users/42/activities/7');
  });

  it('adds and removes favorite information', () => {
    http.post.mockReturnValue(of(undefined));
    http.delete.mockReturnValue(of(undefined));

    const service = createService();
    service.addFavoriteInformation(9).subscribe();
    expect(http.post).toHaveBeenCalledWith('/api/favorites/users/42/informations/9', {});

    service.removeFavoriteInformation(9).subscribe();
    expect(http.delete).toHaveBeenCalledWith('/api/favorites/users/42/informations/9');
  });

    it('handles missing user gracefully', () => {
        const service = createService({ currentUserValue: null });
        service.addFavoriteActivity(7).subscribe();
        expect(http.post).toHaveBeenCalledWith('/api/favorites/users/undefined/activities/7', {});
        service.removeFavoriteActivity(7).subscribe();
        expect(http.delete).toHaveBeenCalledWith('/api/favorites/users/undefined/activities/7');
        service.addFavoriteInformation(9).subscribe();
        expect(http.post).toHaveBeenCalledWith('/api/favorites/users/undefined/informations/9', {});
        service.removeFavoriteInformation(9).subscribe();
        expect(http.delete).toHaveBeenCalledWith('/api/favorites/users/undefined/informations/9');
    });
});
