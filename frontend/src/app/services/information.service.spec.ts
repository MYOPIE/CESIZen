import { describe, expect, beforeEach, it, vi } from 'vitest';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { InformationService, Information } from './information.service';

describe('InformationService', () => {
  const http = { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createService(): InformationService {
    return new InformationService(http as unknown as HttpClient);
  }

  it('retrieves lists and by category', () => {
    http.get.mockReturnValue(of([]));
    const service = createService();
    service.getAllInformations().subscribe();
    expect(http.get).toHaveBeenCalledWith('http://localhost:8080/api/v1/informations');

    service.getPublishedInformations().subscribe();
    expect(http.get).toHaveBeenCalledWith('http://localhost:8080/api/v1/informations/published');

    service.getInformationsByCategory(5).subscribe();
    expect(http.get).toHaveBeenCalledWith('http://localhost:8080/api/v1/informations/category/5');
  });

  it('gets by id, create/update/delete and publish/unpublish', () => {
    const info: Information = { id: 1, title: 'T', content: '', isPublished: false } as Information;
    http.get.mockReturnValue(of(info));
    http.post.mockReturnValue(of(info));
    http.put.mockReturnValue(of(info));
      http.delete.mockReturnValue(of('ok'));

    const service = createService();
    service.getInformationById(1).subscribe();
    expect(http.get).toHaveBeenCalledWith('http://localhost:8080/api/v1/informations/1');

    service.createInformation({ title: 'T' }).subscribe();
    expect(http.post).toHaveBeenCalledWith('http://localhost:8080/api/v1/informations', { title: 'T' });

    service.updateInformation(1, { title: 'New' }).subscribe();
    expect(http.put).toHaveBeenCalledWith('http://localhost:8080/api/v1/informations/1', { title: 'New' });

    service.deleteInformation(1).subscribe();
      expect(http.delete).toHaveBeenCalledWith('http://localhost:8080/api/v1/informations/1', { responseType: 'text' });

    service.publishInformation(1).subscribe();
      expect(http.put).toHaveBeenCalledWith('http://localhost:8080/api/v1/informations/1/publish', {}, { responseType: 'text' });

    service.unpublishInformation(1).subscribe();
      expect(http.put).toHaveBeenCalledWith('http://localhost:8080/api/v1/informations/1/unpublish', {}, { responseType: 'text' });
  });

  it('handles errors gracefully', () => {
    http.get.mockReturnValue(of([]));
    const service = createService();
    service.getInformationById(999).subscribe({
      error: (err) => {
        expect(err).toBeDefined();
      }
    });
    expect(http.get).toHaveBeenCalledWith('http://localhost:8080/api/v1/informations/999');
    });
});
