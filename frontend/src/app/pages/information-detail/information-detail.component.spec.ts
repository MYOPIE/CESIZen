import { describe, expect, it, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { InformationService } from '../../services/information.service';
import { InformationDetailComponent } from './information-detail.component';

describe('InformationDetailComponent', () => {
  const informationService = {
    getInformationById: vi.fn()
  } as unknown as InformationService;

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

  it('loads information detail when id is valid', () => {
    (informationService.getInformationById as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      of({ id: 3, title: 'Sommeil', content: 'Texte', isPublished: true })
    );

    const component = new InformationDetailComponent(createRoute('3'), informationService, sanitizer, cdr);
    component.ngOnInit();

    expect(informationService.getInformationById).toHaveBeenCalledWith(3);
    expect(component.information?.id).toBe(3);
    expect(component.contentBlocks.length).toBeGreaterThan(0);
    expect(component.errorMessage).toBe('');
  });

  it('sets an error message when id is invalid', () => {
    const component = new InformationDetailComponent(createRoute(null), informationService, sanitizer, cdr);
    component.ngOnInit();

    expect(component.errorMessage).toBe('Article introuvable.');
  });

  it('sets an error message when API fails', () => {
    (informationService.getInformationById as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      throwError(() => new Error('not found'))
    );

    const component = new InformationDetailComponent(createRoute('9'), informationService, sanitizer, cdr);
    component.ngOnInit();

    expect(component.errorMessage).toBe('Impossible de charger cet article.');
  });
});
