import { describe, expect, beforeEach, it, vi } from 'vitest';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActiviteService, Activite } from './activite.service';

describe('ActiviteService', () => {
  const http = { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createService(): ActiviteService {
    return new ActiviteService(http as unknown as HttpClient);
  }

  it('gets all activities', () => {
    const items: Activite[] = [];
    http.get.mockReturnValue(of(items));

    const service = createService();
    service.getAllActivites().subscribe();

    expect(http.get).toHaveBeenCalledWith('http://localhost:8080/api/v1/activities');
  });

  it('gets active activities', () => {
    http.get.mockReturnValue(of([]));

    const service = createService();
    service.getActiveActivites().subscribe();

    expect(http.get).toHaveBeenCalledWith('http://localhost:8080/api/v1/activities/active');
  });

  it('gets activity by id and creates/updates/deletes correctly', () => {
    const item: Activite = { id: 1, title: 'A', description: '', content: '', instructions: '', isActive: true };
    http.get.mockReturnValue(of(item));
    http.post.mockReturnValue(of(item));
    http.put.mockReturnValue(of(item));
    http.delete.mockReturnValue(of(undefined));

    const service = createService();
    service.getActiviteById(1).subscribe();
    expect(http.get).toHaveBeenCalledWith('http://localhost:8080/api/v1/activities/1');

    service.createActivite({ title: 'A' }).subscribe();
    expect(http.post).toHaveBeenCalledWith('http://localhost:8080/api/v1/activities', { title: 'A' });

    service.updateActivite(1, { title: 'B' }).subscribe();
    expect(http.put).toHaveBeenCalledWith('http://localhost:8080/api/v1/activities/1', { title: 'B' });

    service.deleteActivite(1).subscribe();
    expect(http.delete).toHaveBeenCalledWith('http://localhost:8080/api/v1/activities/1');
  });

  it('deactivates and reactivates activity', () => {
    http.put.mockReturnValue(of(undefined));

    const service = createService();
    service.deactivateActivite(2).subscribe();
    expect(http.put).toHaveBeenCalledWith('http://localhost:8080/api/v1/activities/2/deactivate', {});

    service.reactivateActivite(2).subscribe();
    expect(http.put).toHaveBeenCalledWith('http://localhost:8080/api/v1/activities/2/reactivate', {});
  });
});
