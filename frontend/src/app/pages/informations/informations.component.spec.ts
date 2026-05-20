import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BehaviorSubject, of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { InformationsComponent } from './informations.component';
import { InformationService, Information } from '../../services/information.service';
import { AuthService, UserResponse } from '../../services/auth.service';
import { CategoryService, Category } from '../../services/category.service';
import { FavoriteService } from '../../services/favorite.service';

describe('InformationsComponent', () => {
  const currentUser$ = new BehaviorSubject<UserResponse | null>(null);

  const informationService = {
    getPublishedInformations: vi.fn().mockReturnValue(of([]))
  } as unknown as InformationService;

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
    addFavoriteInformation: vi.fn().mockReturnValue(of(void 0)),
    removeFavoriteInformation: vi.fn().mockReturnValue(of(void 0))
  } as unknown as FavoriteService;

  const cdr = {
    detectChanges: vi.fn()
  } as unknown as ChangeDetectorRef;

  beforeEach(() => {
    currentUser$.next(null);
    vi.clearAllMocks();
  });

  function createComponent(): InformationsComponent {
    return new InformationsComponent(
      informationService,
      authService,
      router as never,
      categoryService,
      favoriteService,
      cdr
    );
  }

  it('filters articles by category when one is selected', () => {
    const component = createComponent();
    const categoryA: Category = { id: 1, name: 'Bien-être', type: 'INFORMATION' };
    const categoryB: Category = { id: 2, name: 'Soutien', type: 'INFORMATION' };

    component.articles = [
      { id: 1, title: 'A', content: '', isPublished: true, category: categoryA },
      { id: 2, title: 'B', content: '', isPublished: true, category: categoryB },
      { id: 3, title: 'C', content: '', isPublished: true, category: categoryA }
    ];

    component.selectedCategoryIds = [1];

    expect(component.filteredArticles.map((article) => article.id)).toEqual([1, 3]);
  });

  it('redirects anonymous users when toggling a favorite', () => {
    const component = createComponent();
    const article: Information = {
      id: 10,
      title: 'Gestion du stress',
      content: 'Contenu',
      isPublished: true
    };

    component.toggleFavorite(article);

    expect(router.navigate).toHaveBeenCalledWith(['/compte']);
    expect(article.isFavorite).toBeUndefined();
  });

  it('toggles article favorites for connected users', () => {
    const user: UserResponse = {
      id: 5,
      email: 'user@example.com',
      firstName: 'User',
      lastName: 'Demo',
      role: 'ROLE_USER',
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-02T00:00:00Z'
    };
    const component = createComponent();
    const article: Information = {
      id: 10,
      title: 'Gestion du stress',
      content: 'Contenu',
      isPublished: true,
      isFavorite: false
    };

    component.ngOnInit();
    currentUser$.next(user);

    component.toggleFavorite(article);

    expect(favoriteService.addFavoriteInformation).toHaveBeenCalledWith(10);
    expect(article.isFavorite).toBe(true);
  });

  it('loads published articles and categories on init', () => {
    const articles: Information[] = [
      { id: 1, title: 'Article', content: 'Contenu', isPublished: true }
    ];
    const categories: Category[] = [
      { id: 1, name: 'Bien-être', type: 'INFORMATION' }
    ];
    (informationService.getPublishedInformations as unknown as ReturnType<typeof vi.fn>).mockReturnValue(of(articles));
    (categoryService.getCategories as unknown as ReturnType<typeof vi.fn>).mockReturnValue(of(categories));

    const component = createComponent();
    component.ngOnInit();

    expect(informationService.getPublishedInformations).toHaveBeenCalledTimes(1);
    expect(categoryService.getCategories).toHaveBeenCalledWith('INFORMATION');
    expect(component.articles).toEqual(articles);
    expect(component.categories).toEqual(categories);
  });
});