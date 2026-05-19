import { describe, expect, beforeEach, it, vi } from 'vitest';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CategoryService, Category } from './category.service';

describe('CategoryService', () => {
  const http = { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createService(): CategoryService {
    return new CategoryService(http as unknown as HttpClient);
  }

  it('fetches categories without type', () => {
    http.get.mockReturnValue(of([]));
    const service = createService();
    service.getCategories().subscribe();
    expect(http.get).toHaveBeenCalledWith('http://localhost:8080/api/v1/categories');
  });

  it('fetches categories with type', () => {
    http.get.mockReturnValue(of([]));
    const service = createService();
    service.getCategories('ACTIVITY').subscribe();
    expect(http.get).toHaveBeenCalledWith('http://localhost:8080/api/v1/categories?type=ACTIVITY');
  });

  it('creates, updates and deletes a category', () => {
    const cat: Category = { id: 1, name: 'Test', type: 'ACTIVITY' };
    http.post.mockReturnValue(of(cat));
    http.put.mockReturnValue(of(cat));
    http.delete.mockReturnValue(of(undefined));

    const service = createService();
    service.createCategory({ name: 'Test' }).subscribe();
    expect(http.post).toHaveBeenCalledWith('http://localhost:8080/api/v1/categories', { name: 'Test' });

    service.updateCategory(1, { name: 'Updated' }).subscribe();
    expect(http.put).toHaveBeenCalledWith('http://localhost:8080/api/v1/categories/1', { name: 'Updated' });

    service.deleteCategory(1).subscribe();
    expect(http.delete).toHaveBeenCalledWith('http://localhost:8080/api/v1/categories/1');
  });
});
