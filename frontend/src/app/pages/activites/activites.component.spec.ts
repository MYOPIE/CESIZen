import { describe, expect, it, vi } from 'vitest';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { ActivitesComponent } from './activites.component';
import { ActiviteService, Activite } from '../../services/activite.service';
import { AuthService, UserResponse } from '../../services/auth.service';
import { CategoryService, Category } from '../../services/category.service';
import { ContentRefreshService } from '../../services/content-refresh.service';
import { FavoriteService } from '../../services/favorite.service';

describe('ActivitesComponent', () => {
  const currentUser$ = new BehaviorSubject<UserResponse | null>(null);

  const activiteService = {
    getActiveActivites: vi.fn().mockReturnValue(of([]))
  } as unknown as ActiviteService;

  const authService = {
    currentUser$: currentUser$.asObservable()
  } as unknown as AuthService;

  const router = {
    navigate: vi.fn()
  };

  const categoryService = {
    getCategories: vi.fn().mockReturnValue(of([]))
  } as unknown as CategoryService;

  const favoriteService = {
    addFavoriteActivity: vi.fn().mockReturnValue(of(void 0)),
    removeFavoriteActivity: vi.fn().mockReturnValue(of(void 0))
  } as unknown as FavoriteService;

  const contentRefreshService = {
    activitiesChanged$: new Subject<void>().asObservable()
  } as unknown as ContentRefreshService;

  const cdr = {
    detectChanges: vi.fn()
  } as unknown as ChangeDetectorRef;

  function createComponent(): ActivitesComponent {
    return new ActivitesComponent(
      activiteService,
      authService,
      router as never,
      categoryService,
      favoriteService,
      contentRefreshService,
      cdr
    );
  }

  it('filters and sorts activities by the selected category', () => {
    const component = createComponent();
    const categoryA: Category = { id: 1, name: 'Relaxation', type: 'ACTIVITY' };
    const categoryB: Category = { id: 2, name: 'Respiration', type: 'ACTIVITY' };

    component.activites = [
      { id: 2, title: 'B', description: '', content: '', instructions: '', isActive: true, category: categoryA, duree: 20 },
      { id: 1, title: 'A', description: '', content: '', instructions: '', isActive: true, category: categoryB, durationMinutes: 10 },
      { id: 3, title: 'C', description: '', content: '', instructions: '', isActive: true, category: categoryA, durationMinutes: 5 }
    ];

    component.selectedCategoryIds = [1];

    expect(component.filteredActivites.map((activite) => activite.id)).toEqual([3, 2]);
  });

  it('changes the selected category without side effects', () => {
    const component = createComponent();

    component.filterByCategory(2);

    expect(component.selectedCategoryIds).toEqual([2]);
  });

  it('redirects unauthenticated users to the account page before toggling favorites', () => {
    const component = createComponent();
    const activity: Activite = {
      id: 12,
      title: 'Respiration',
      description: '',
      content: '',
      instructions: '',
      isActive: true
    };

    component.toggleFavorite(activity);

    expect(router.navigate).toHaveBeenCalledWith(['/compte']);
    expect(activity.isFavorite).toBeUndefined();
  });

  it('calls the favorite service when a logged user toggles a favorite', () => {
    const user: UserResponse = {
      id: 9,
      email: 'user@example.com',
      firstName: 'User',
      lastName: 'Test',
      role: 'ROLE_USER',
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-02T00:00:00Z'
    };
    const component = createComponent();
    const activity: Activite = {
      id: 12,
      title: 'Respiration',
      description: '',
      content: '',
      instructions: '',
      isActive: true,
      isFavorite: false
    };

    component.ngOnInit();
    currentUser$.next(user);

    component.toggleFavorite(activity);

    expect(favoriteService.addFavoriteActivity).toHaveBeenCalledWith(12);
    expect(activity.isFavorite).toBe(true);
    currentUser$.next(null);
  });
});