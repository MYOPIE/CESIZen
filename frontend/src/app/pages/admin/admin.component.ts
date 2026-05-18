import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActiviteService, Activite } from '../../services/activite.service';
import { InformationService, Information } from '../../services/information.service';
import { CategoryService, Category } from '../../services/category.service';
import { DifficultyService, DifficultyLevel } from '../../services/difficulty.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  currentTab: 'activites' | 'informations' | 'categories' = 'activites';

  activites: Activite[] = [];
  informations: Information[] = [];
  categories: Category[] = [];
  difficultyLevels: DifficultyLevel[] = [];
  
  activityCategories: Category[] = [];
  informationCategories: Category[] = [];

  showActiviteForm = false;
  newActivite: Partial<Activite> & { categoryId?: number, difficultyLevelId?: number } = { title: '', description: '', image: '', isActive: true, duree: 15 };

  showInformationForm = false;
  newInformation: Partial<Information> & { categoryId?: number } = { title: '', content: '', readingTime: 3, isPublished: true };

  showCategoryForm = false;
  newCategory: Partial<Category> = { name: '', type: 'ACTIVITY' };

  constructor(
    private activiteService: ActiviteService,
    private informationService: InformationService,
    private categoryService: CategoryService,
    private difficultyService: DifficultyService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'informations') this.currentTab = 'informations';
      else if (params['tab'] === 'categories') this.currentTab = 'categories';
      else this.currentTab = 'activites';
    });

    this.authService.currentUser$.subscribe(user => {
      if (!user || user.role !== 'ROLE_ADMIN') {
        // this.router.navigate(['/']);
      }
    });

    this.loadAllData();
  }

  loadAllData(): void {
    this.loadActivites();
    this.loadInformations();
    this.loadCategories();
    this.loadDifficultyLevels();
  }

  loadDifficultyLevels(): void {
    this.difficultyService.getAllDifficultyLevels().subscribe(data => {
      this.difficultyLevels = data;
      this.cdr.detectChanges();
    });
  }

  setTab(tab: 'activites' | 'informations' | 'categories'): void {
    this.currentTab = tab;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge',
    });
  }

  // --- CATEGORIES --- //
  loadCategories(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
      this.activityCategories = data.filter(c => c.type === 'ACTIVITY');
      this.informationCategories = data.filter(c => c.type === 'INFORMATION');
      this.cdr.detectChanges();
    });
  }

  createCategory(): void {
    this.showCategoryForm = true;
    this.cdr.detectChanges();
  }

  submitCategory(): void {
    if (!this.newCategory.name || !this.newCategory.type) return;

    this.categoryService.createCategory(this.newCategory).subscribe({
      next: () => {
        this.loadCategories();
        this.cancelCategoryForm();
      },
      error: (err) => {
        console.error('Erreur création catégorie', err);
        alert('Erreur lors de la création de la catégorie');
      }
    });
  }

  cancelCategoryForm(): void {
    this.showCategoryForm = false;
    this.newCategory = { name: '', type: 'ACTIVITY' };
    this.cdr.detectChanges();
  }

  deleteCategory(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (err) => console.error('Erreur suppression catégorie', err)
      });
    }
  }

  // --- ACTIVITES --- //
  loadActivites(): void {
    this.activiteService.getAllActivites().subscribe({
      next: (data) => {
        this.activites = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur chargement activités', err)
    });
  }

  createActivite(): void {
    this.showActiviteForm = true;
    this.cdr.detectChanges();
  }

  submitActivite(): void {
    if (!this.newActivite.title || !this.newActivite.description || !this.newActivite.categoryId || !this.newActivite.difficultyLevelId) return;
    
    // Le backend (ActivityRequest) attend categoryId et durationMinutes
    const payload: Partial<Activite> & { categoryId?: number, difficultyLevelId?: number, durationMinutes?: number } = {
      ...this.newActivite,
      durationMinutes: this.newActivite.duree
    };

    if (this.newActivite.id) {
      this.activiteService.updateActivite(this.newActivite.id, payload).subscribe({
        next: () => {
          this.loadActivites();
          this.cancelActiviteForm();
        },
        error: (err) => {
          console.error('Erreur mise à jour activité', err);
          alert('Erreur lors de la mise à jour de l\'activité');
        }
      });
    } else {
      this.activiteService.createActivite(payload).subscribe({
        next: () => {
          this.loadActivites();
          this.cancelActiviteForm();
        },
        error: (err) => {
          console.error('Erreur création activité', err);
          alert('Erreur lors de la création de l\'activité');
        }
      });
    }
  }

  cancelActiviteForm(): void {
    this.showActiviteForm = false;
    this.newActivite = { title: '', description: '', image: '', isActive: true, duree: 15 };
    this.cdr.detectChanges();
  }

  editActivite(activite: Activite): void {
    this.newActivite = {
      ...activite,
      categoryId: activite.category?.id,
      difficultyLevelId: activite.difficultyLevel?.id
    };
    this.showActiviteForm = true;
    this.cdr.detectChanges();
  }

  deleteActivite(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
      this.activiteService.deleteActivite(id).subscribe({
        next: () => this.loadActivites(),
        error: (err) => console.error('Erreur suppression activité', err)
      });
    }
  }

  toggleActiviteActive(activite: Activite): void {
    const request = activite.isActive 
      ? this.activiteService.deactivateActivite(activite.id)
      : this.activiteService.reactivateActivite(activite.id);
      
    request.subscribe({
      next: () => {
        this.loadActivites();
      },
      error: (err) => console.error('Erreur mise à jour de l\'état de l\'activité', err)
    });
  }

  // --- INFORMATIONS --- //
  loadInformations(): void {
    this.informationService.getAllInformations().subscribe({
      next: (data) => {
        this.informations = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur chargement informations', err)
    });
  }

  createInformation(): void {
    this.showInformationForm = true;
    this.cdr.detectChanges();
  }

  submitInformation(): void {
    if (!this.newInformation.title || !this.newInformation.content || !this.newInformation.categoryId) return;

    const payload: Partial<Information> & { categoryId?: number } = {
      ...this.newInformation
    };

    if (this.newInformation.id) {
      this.informationService.updateInformation(this.newInformation.id, payload).subscribe({
        next: () => {
          this.loadInformations();
          this.cancelInformationForm();
        },
        error: (err) => {
          console.error('Erreur mise à jour information', err);
          alert('Erreur lors de la mise à jour de l\'information');
        }
      });
    } else {
      this.informationService.createInformation(payload).subscribe({
        next: () => {
          this.loadInformations();
          this.cancelInformationForm();
        },
        error: (err) => {
          console.error('Erreur création information', err);
          alert('Erreur lors de la création de l\'information');
        }
      });
    }
  }

  cancelInformationForm(): void {
    this.showInformationForm = false;
    this.newInformation = { title: '', content: '', readingTime: 3, isPublished: true };
    this.cdr.detectChanges();
  }

  editInformation(info: Information): void {
    this.newInformation = {
      ...info,
      categoryId: info.category?.id
    };
    this.showInformationForm = true;
    this.cdr.detectChanges();
  }

  deleteInformation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette information ?')) {
      this.informationService.deleteInformation(id).subscribe({
        next: () => this.loadInformations(),
        error: (err) => console.error('Erreur suppression information', err)
      });
    }
  }

  toggleInformationPublished(info: Information): void {
    const request = info.isPublished 
      ? this.informationService.unpublishInformation(info.id)
      : this.informationService.publishInformation(info.id);

    request.subscribe({
      next: () => {
         this.loadInformations();
      },
      error: (err) => console.error('Erreur mise à jour statut information', err)
    });
  }
}
