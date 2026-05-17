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
  currentTab: 'activites' | 'informations' = 'activites';

  activites: Activite[] = [];
  informations: Information[] = [];
  
  activityCategories: Category[] = [];
  informationCategories: Category[] = [];

  showActiviteForm = false;
  newActivite: Partial<Activite> & { categoryId?: number } = { title: '', description: '', image: '', isActive: true, duree: 15, difficulte: 1 };

  showInformationForm = false;
  newInformation: Partial<Information> & { categoryId?: number } = { title: '', content: '', readingTime: 3, isPublished: true };

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
      this.currentTab = params['tab'] === 'informations' ? 'informations' : 'activites';
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

  setTab(tab: 'activites' | 'informations'): void {
    this.currentTab = tab;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge',
    });
  }

  // --- CATEGORIES --- //
  loadCategories(): void {
    this.categoryService.getCategories('ACTIVITY').subscribe(data => {
      this.activityCategories = data;
    });
    this.categoryService.getCategories('INFORMATION').subscribe(data => {
      this.informationCategories = data;
    });
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
  }

  submitActivite(): void {
    if (!this.newActivite.title || !this.newActivite.description || !this.newActivite.categoryId) return;
    
    const payload: Partial<Activite> = {
      ...this.newActivite,
      category: { id: this.newActivite.categoryId } as Category
    };
    delete (payload as any).categoryId;


    this.activiteService.createActivite(payload).subscribe({
      next: () => {
        this.loadActivites();
        this.cancelActiviteForm();
      },
      error: (err) => console.error('Erreur création activité', err)
    });
  }

  cancelActiviteForm(): void {
    this.showActiviteForm = false;
    this.newActivite = { title: '', description: '', image: '', isActive: true, duree: 15, difficulte: 1 };
  }

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
  }

  submitInformation(): void {
    if (!this.newInformation.title || !this.newInformation.content || !this.newInformation.categoryId) return;

    const payload: Partial<Information> = {
      ...this.newInformation,
      category: { id: this.newInformation.categoryId } as Category
    };
    delete (payload as any).categoryId;

    this.informationService.createInformation(payload).subscribe({
      next: () => {
        this.loadInformations();
        this.cancelInformationForm();
      },
      error: (err) => console.error('Erreur création information', err)
    });
  }

  cancelInformationForm(): void {
    this.showInformationForm = false;
    this.newInformation = { title: '', content: '', readingTime: 3, isPublished: true };
  }

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
