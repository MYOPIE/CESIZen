import { describe, expect, beforeEach, it, vi } from 'vitest';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';

describe('UserService', () => {
  const http = { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createService(): UserService {
    return new UserService(http as unknown as HttpClient);
  }

  it('calls GET all users', () => {
    http.get.mockReturnValue(of([]));
    const s = createService();
    s.getAllUsers().subscribe();
    expect(http.get).toHaveBeenCalledWith('http://localhost:8080/api/v1/users');
  });

  it('calls promote/demote/deactivate/delete endpoints', () => {
    http.put.mockReturnValue(of('ok'));
    http.delete.mockReturnValue(of('ok'));

    const s = createService();
    s.promoteToAdmin(1).subscribe();
    expect(http.put).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/1/promote-admin', {}, { responseType: 'text' });

    s.demoteFromAdmin(2).subscribe();
    expect(http.put).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/2/demote-admin', {}, { responseType: 'text' });

    s.deactivateUser(3).subscribe();
    expect(http.put).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/3/deactivate', {}, { responseType: 'text' });

    s.reactivateUser(5).subscribe();
    expect(http.put).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/5/reactivate', {}, { responseType: 'text' });

    s.deleteUser(4).subscribe();
    expect(http.delete).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/4', { responseType: 'text' });
  });
});
