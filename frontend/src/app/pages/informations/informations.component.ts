import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { InformationService, Information } from '../../services/information.service';
import { AuthService } from '../../services/auth.service';
import { CategoryService, Category } from '../../services/category.service';
import { ContentRefreshService } from '../../services/content-refresh.service';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-informations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.scss']
})
export class InformationsComponent implements OnInit {
  articles: Information[] = [];
  categories: Category[] = [];
  selectedCategoryIds: number[] = [];
  isAdmin = false;
  isLoggedIn = false;

  constructor(
    private informationService: InformationService,
    private authService: AuthService,
    private router: Router,
    private categoryService: CategoryService,
    private favoriteService: FavoriteService,
    private contentRefreshService: ContentRefreshService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInformations();
    this.loadCategories();

    this.contentRefreshService.informationsChanged$.subscribe(() => this.loadInformations());

    this.authService.currentUser$.subscribe(user => {
      this.isAdmin = user?.role === 'ROLE_ADMIN';
      this.isLoggedIn = !!user;
    });
  }

  loadInformations(): void {
    this.informationService.getPublishedInformations().subscribe({
      next: (data) => {
        this.articles = data;
        if (this.authService.currentUserValue) {
          this.favoriteService.getFavoriteInformations().subscribe({
            next: (fav) => {
              const favIds = new Set(fav.map((i: any) => i.id));
              this.articles.forEach(a => a.isFavorite = favIds.has(a.id));
              this.cdr.detectChanges();
            },
            error: () => this.cdr.detectChanges()
          });
        } else {
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Erreur lors du chargement des informations', err)
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories('INFORMATION').subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur lors du chargement des catégories', err)
    });
  }

  get filteredArticles() {
    if (!this.selectedCategoryIds || this.selectedCategoryIds.length === 0) {
      return this.articles;
    }
    return this.articles.filter(a => a.category && this.selectedCategoryIds.includes(a.category.id));
  }

  filterByCategory(categoryId: number | null): void {
    if (categoryId === null) {
      this.selectedCategoryIds = [];
      return;
    }

    const idx = this.selectedCategoryIds.indexOf(categoryId);
    if (idx === -1) {
      this.selectedCategoryIds.push(categoryId);
    } else {
      this.selectedCategoryIds.splice(idx, 1);
    }
  }

  toggleFavorite(info: Information): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/compte']);
      return;
    }

    info.isFavorite = !info.isFavorite;
    const action = info.isFavorite
      ? this.favoriteService.addFavoriteInformation(info.id)
      : this.favoriteService.removeFavoriteInformation(info.id);

    action.subscribe({
      error: (err) => {
        console.error('Erreur lors du changement de favori', err);
        info.isFavorite = !info.isFavorite; // Revert on error
      }
    });
  }
}
