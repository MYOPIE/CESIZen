import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { AdminComponent } from './admin.component';
import { ActiviteService } from '../../services/activite.service';
import { InformationService } from '../../services/information.service';
import { CategoryService } from '../../services/category.service';
import { DifficultyService } from '../../services/difficulty.service';
import { AuthService } from '../../services/auth.service';

describe('AdminComponent', () => {
  const activiteService = {
    getAllActivites: vi.fn().mockReturnValue(of([])),
    createActivite: vi.fn().mockReturnValue(of(void 0)),
    updateActivite: vi.fn().mockReturnValue(of(void 0)),
    deleteActivite: vi.fn().mockReturnValue(of(void 0)),
    deactivateActivite: vi.fn().mockReturnValue(of(void 0)),
    reactivateActivite: vi.fn().mockReturnValue(of(void 0))
  } as unknown as ActiviteService;

  const informationService = {
    getAllInformations: vi.fn().mockReturnValue(of([])),
    createInformation: vi.fn().mockReturnValue(of(void 0)),
    updateInformation: vi.fn().mockReturnValue(of(void 0)),
    deleteInformation: vi.fn().mockReturnValue(of(void 0)),
    publishInformation: vi.fn().mockReturnValue(of(void 0)),
    unpublishInformation: vi.fn().mockReturnValue(of(void 0))
  } as unknown as InformationService;

  const categoryService = {
    getCategories: vi.fn().mockReturnValue(of([])),
    createCategory: vi.fn().mockReturnValue(of(void 0)),
    deleteCategory: vi.fn().mockReturnValue(of(void 0))
  } as unknown as CategoryService;

  const difficultyService = {
    getAllDifficultyLevels: vi.fn().mockReturnValue(of([]))
  } as unknown as DifficultyService;

  const authService = {
    currentUser$: of({ role: 'ROLE_ADMIN' })
  } as unknown as AuthService;

  const router = {
    navigate: vi.fn()
  };

  const route = {
    queryParams: of({ tab: 'categories' })
  };

  const cdr = {
    detectChanges: vi.fn()
  } as unknown as ChangeDetectorRef;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createComponent(): AdminComponent {
    return new AdminComponent(
      activiteService,
      informationService,
      categoryService,
      difficultyService,
      authService,
      router as never,
      route as never,
      cdr
    );
  }

  it('loads all datasets and honors the query tab on init', () => {
    const component = createComponent();
    component.ngOnInit();

    expect(component.currentTab).toBe('categories');
    expect(activiteService.getAllActivites).toHaveBeenCalledTimes(1);
    expect(informationService.getAllInformations).toHaveBeenCalledTimes(1);
    expect(categoryService.getCategories).toHaveBeenCalledTimes(1);
    expect(difficultyService.getAllDifficultyLevels).toHaveBeenCalledTimes(1);
  });

  it('changes tabs and syncs the router query params', () => {
    const component = createComponent();

    component.setTab('informations');

    expect(component.currentTab).toBe('informations');
    expect(router.navigate).toHaveBeenCalledWith([], {
      relativeTo: route,
      queryParams: { tab: 'informations' },
      queryParamsHandling: 'merge'
    });
  });

  it('sorts activities by title and toggles direction when called twice', () => {
    const component = createComponent();

    component.sortActivites('title');
    expect(component.activitesSortColumn).toBe('title');
    expect(component.activitesSortDirection).toBe('asc');

    component.sortActivites('title');
    expect(component.activitesSortDirection).toBe('desc');
  });

  it('derives category buckets from the loaded categories', () => {
    (categoryService.getCategories as unknown as ReturnType<typeof vi.fn>).mockReturnValue(of([
      { id: 1, name: 'Relaxation', type: 'ACTIVITY' },
      { id: 2, name: 'Stress', type: 'INFORMATION' }
    ]));

    const component = createComponent();
    component.loadCategories();

    expect(component.activityCategories).toEqual([{ id: 1, name: 'Relaxation', type: 'ACTIVITY' }]);
    expect(component.informationCategories).toEqual([{ id: 2, name: 'Stress', type: 'INFORMATION' }]);
  });
});