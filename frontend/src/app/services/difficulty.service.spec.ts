import { describe, expect, beforeEach, it, vi } from 'vitest';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DifficultyService, DifficultyLevel } from './difficulty.service';

describe('DifficultyService', () => {
  const http = { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createService(): DifficultyService {
    return new DifficultyService(http as unknown as HttpClient);
  }

  it('gets all and published difficulty levels', () => {
    http.get.mockReturnValue(of([]));
    const service = createService();
    service.getAllDifficultyLevels().subscribe();
    expect(http.get).toHaveBeenCalledWith('http://localhost:8080/api/v1/difficulty-levels');

    service.getPublishedDifficultyLevels().subscribe();
    expect(http.get).toHaveBeenCalledWith('http://localhost:8080/api/v1/difficulty-levels/published');
  });

  it('handles getById, create, update, delete', () => {
    const lvl: DifficultyLevel = { id: 1, name: 'Easy', isPublished: true };
    http.get.mockReturnValue(of(lvl));
    http.post.mockReturnValue(of(lvl));
    http.put.mockReturnValue(of(lvl));
    http.delete.mockReturnValue(of(undefined));

    const service = createService();
    service.getDifficultyLevelById(1).subscribe();
    expect(http.get).toHaveBeenCalledWith('http://localhost:8080/api/v1/difficulty-levels/1');

    service.createDifficultyLevel({ name: 'Easy' }).subscribe();
    expect(http.post).toHaveBeenCalledWith('http://localhost:8080/api/v1/difficulty-levels', { name: 'Easy' });

    service.updateDifficultyLevel(1, { name: 'Hard' }).subscribe();
    expect(http.put).toHaveBeenCalledWith('http://localhost:8080/api/v1/difficulty-levels/1', { name: 'Hard' });

    service.deleteDifficultyLevel(1).subscribe();
    expect(http.delete).toHaveBeenCalledWith('http://localhost:8080/api/v1/difficulty-levels/1');
  });
});
