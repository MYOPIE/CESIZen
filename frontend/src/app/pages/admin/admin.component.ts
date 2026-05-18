import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActiviteService, Activite } from '../../services/activite.service';
import { InformationService, Information } from '../../services/information.service';
import { CategoryService, Category } from '../../services/category.service';
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
  
  activityCategories: Category[] = [];
  informationCategories: Category[] = [];

  showActiviteForm = false;
  newActivite: Partial<Activite> & { categoryId?: number } = { title: '', description: '', image: '', isActive: true, duree: 15, difficulte: 1 };

  showInformationForm = false;
  newInformation: Partial<Information> & { categoryId?: number } = { title: '', content: '', readingTime: 3, isPublished: true };

  showCategoryForm = false;
  newCategory: Partial<Category> = { name: '', type: 'ACTIVITY' };

  constructor(
    private activiteService: ActiviteService,
    private informationService: InformationService,
    private categoryService: CategoryService,
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
    // TODO : récupérer les niveaux de difficulté pour permettre à l'admin de les sélectionner lors de la création d'une activité + mettre à jour le temps de lecture dans le champ en base
    this.showActiviteForm = true;
    this.cdr.detectChanges();
  }

  submitActivite(): void {
    if (!this.newActivite.title || !this.newActivite.description || !this.newActivite.categoryId) return;
    
    // Le backend (ActivityRequest) attend categoryId en tant que champ plat
    const payload: Partial<Activite> & { categoryId?: number } = {
      ...this.newActivite
    };

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

  cancelActiviteForm(): void {
    this.showActiviteForm = false;
    this.newActivite = { title: '', description: '', image: '', isActive: true, duree: 15, difficulte: 1 };
    this.cdr.detectChanges();
  }

  // TODO : implémenter les méthodes d'édition d'activités + permettre de les désactiver/réactiver (isActive) pour les différencier des activités visibles sur le site sans les supprimer définitivement
  editActivite(activite: Activite): void {
    alert('Modification de l\'activité : ' + activite.title);
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
        const index = this.activites.findIndex(a => a.id === activite.id);
        if (index > -1) {
          this.activites[index].isActive = !this.activites[index].isActive;
          this.cdr.detectChanges();
        } else {
          this.loadActivites();
        }
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

    // Le backend (InformationRequest) attend categoryId
    const payload: Partial<Information> & { categoryId?: number } = {
      ...this.newInformation
    };

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

  cancelInformationForm(): void {
    this.showInformationForm = false;
    this.newInformation = { title: '', content: '', readingTime: 3, isPublished: true };
    this.cdr.detectChanges();
  }

  // TODO : implémenter les méthodes d'édition d'informations + permettre de les publier/dépublier pour les différencier des informations visibles sur le site sans les supprimer définitivement
  editInformation(info: Information): void {
    alert('Modification de l\'information : ' + info.title);
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
         const index = this.informations.findIndex(i => i.id === info.id);
        if (index > -1) {
          this.informations[index].isPublished = !this.informations[index].isPublished;
          this.cdr.detectChanges();
        } else {
          this.loadInformations();
        }
      },
      error: (err) => console.error('Erreur mise à jour statut information', err)
    });
  }
}
