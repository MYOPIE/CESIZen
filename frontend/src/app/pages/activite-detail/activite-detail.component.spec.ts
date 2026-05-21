import { describe, expect, it, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ActiviteService } from '../../services/activite.service';
import { ActiviteDetailComponent } from './activite-detail.component';

describe('ActiviteDetailComponent', () => {
  const activiteService = {
    getActiviteById: vi.fn()
  } as unknown as ActiviteService;

  const cdr = {
    detectChanges: vi.fn()
  } as unknown as ChangeDetectorRef;

  const sanitizer = {
    bypassSecurityTrustResourceUrl: vi.fn((value: string) => value)
  } as unknown as DomSanitizer;

  function createRoute(id: string | null): ActivatedRoute {
    return {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue(id)
        }
      }
    } as unknown as ActivatedRoute;
  }

  it('loads the activity detail when id is valid', () => {
    (activiteService.getActiviteById as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      of({ id: 2, title: 'Respiration', description: '', content: '', instructions: '', isActive: true })
    );

    const component = new ActiviteDetailComponent(createRoute('2'), activiteService, sanitizer, cdr);
    component.ngOnInit();

    expect(activiteService.getActiviteById).toHaveBeenCalledWith(2);
    expect(component.activite?.id).toBe(2);
    expect(component.contentBlocks.length).toBe(0);
    expect(component.errorMessage).toBe('');
  });

  it('sets an error message when id is invalid', () => {
    const component = new ActiviteDetailComponent(createRoute('abc'), activiteService, sanitizer, cdr);
    component.ngOnInit();

    expect(component.errorMessage).toBe('Activite introuvable.');
  });

  it('sets an error message when API fails', () => {
    (activiteService.getActiviteById as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      throwError(() => new Error('not found'))
    );

    const component = new ActiviteDetailComponent(createRoute('4'), activiteService, sanitizer, cdr);
    component.ngOnInit();

    expect(component.errorMessage).toBe('Impossible de charger cette activite.');
  });
});
