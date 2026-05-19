import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { HomeComponent } from './home.component';
import { ActiviteService } from '../../services/activite.service';
import { AuthService } from '../../services/auth.service';
import { InformationService } from '../../services/information.service';

describe('HomeComponent', () => {
  const activiteService = {
    getActiveActivites: vi.fn()
  } as unknown as ActiviteService;

  const authService = {
    getAllUsers: vi.fn()
  } as unknown as AuthService;

  const informationService = {
    getPublishedInformations: vi.fn()
  } as unknown as InformationService;

  const cdr = {
    detectChanges: vi.fn()
  } as unknown as ChangeDetectorRef;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createComponent(): HomeComponent {
    return new HomeComponent(activiteService, authService, informationService, cdr);
  }

  it('updates the stats from the loaded data', () => {
    (authService.getAllUsers as unknown as ReturnType<typeof vi.fn>).mockReturnValue(of([{ id: 1 }]));
    (activiteService.getActiveActivites as unknown as ReturnType<typeof vi.fn>).mockReturnValue(of([{ id: 1 }]));
    (informationService.getPublishedInformations as unknown as ReturnType<typeof vi.fn>).mockReturnValue(of([{ id: 1 }]));

    const component = createComponent();
    component.ngOnInit();

    expect(component.stats).toEqual([
      { label: 'Comptes créés', value: '1' },
      { label: 'Activités disponibles', value: '1' },
      { label: 'Informations en ligne', value: '1' }
    ]);
  });

  it('falls back to placeholder values when a source fails', () => {
    (authService.getAllUsers as unknown as ReturnType<typeof vi.fn>).mockReturnValue(throwError(() => new Error('users')));
    (activiteService.getActiveActivites as unknown as ReturnType<typeof vi.fn>).mockReturnValue(throwError(() => new Error('activities')));
    (informationService.getPublishedInformations as unknown as ReturnType<typeof vi.fn>).mockReturnValue(throwError(() => new Error('infos')));

    const component = createComponent();
    component.ngOnInit();

    expect(component.stats).toEqual([
      { label: 'Comptes créés', value: '-' },
      { label: 'Activités disponibles', value: '-' },
      { label: 'Informations en ligne', value: '-' }
    ]);
  });
});