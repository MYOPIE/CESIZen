import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ActiviteService, Activite } from '../../services/activite.service';
import { AuthService } from '../../services/auth.service';
import { CategoryService, Category } from '../../services/category.service';
import { ContentRefreshService } from '../../services/content-refresh.service';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-activites',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './activites.component.html',
  styleUrls: ['./activites.component.scss']
})
export class ActivitesComponent implements OnInit {
  activites: Activite[] = [];
  categories: Category[] = [];
  selectedCategoryIds: number[] = [];
  sortBy = 'duree';
  
  isLoggedIn = false;
  isAdmin = false;

  constructor(
    private activiteService: ActiviteService,
    public authService: AuthService,
    private router: Router,
    private categoryService: CategoryService,
    private favoriteService: FavoriteService,
    private contentRefreshService: ContentRefreshService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadActivities();
    this.loadCategories();

    this.contentRefreshService.activitiesChanged$.subscribe(() => this.loadActivities());

    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === 'ROLE_ADMIN';
    });
  }

  loadActivities(): void {
    this.activiteService.getActiveActivites().subscribe({
      next: (data) => {
        this.activites = data;
        // Si l'utilisateur est connecté, récupérer ses favoris et marquer les activités
        if (this.authService.currentUserValue) {
          this.favoriteService.getFavoriteActivities().subscribe({
            next: (fav) => {
              const favIds = new Set(fav.map((a: any) => a.id));
              this.activites.forEach(a => a.isFavorite = favIds.has(a.id));
              this.cdr.detectChanges();
            },
            error: () => this.cdr.detectChanges()
          });
        } else {
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Erreur lors du chargement des activités', err)
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories('ACTIVITY').subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur lors du chargement des catégories', err)
    });
  }

  get filteredActivites() {
    let filtered = this.activites;

    if (this.selectedCategoryIds && this.selectedCategoryIds.length > 0) {
      filtered = filtered.filter(a => a.category && this.selectedCategoryIds.includes(a.category.id));
    }

    // Tri
    if (this.sortBy === 'duree') {
      filtered.sort((a, b) => (a.durationMinutes || a.duree || 0) - (b.durationMinutes || b.duree || 0));
    } else if (this.sortBy === 'nom') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
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

  toggleFavorite(activite: Activite): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/compte']);
      return;
    }

    activite.isFavorite = !activite.isFavorite;
    const action = activite.isFavorite 
      ? this.favoriteService.addFavoriteActivity(activite.id)
      : this.favoriteService.removeFavoriteActivity(activite.id);

    action.subscribe({
      error: (err) => {
        console.error('Erreur lors du changement de favori', err);
        activite.isFavorite = !activite.isFavorite; // Annuler en erreur
      }
    });
  }
}
