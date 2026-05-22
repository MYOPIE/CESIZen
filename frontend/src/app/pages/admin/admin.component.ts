import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActiviteService, Activite } from '../../services/activite.service';
import { InformationService, Information } from '../../services/information.service';
import { CategoryService, Category } from '../../services/category.service';
import { DifficultyService, DifficultyLevel } from '../../services/difficulty.service';
import { AuthService, UserResponse } from '../../services/auth.service';
import { ContentRefreshService } from '../../services/content-refresh.service';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  currentTab: 'activites' | 'informations' | 'categories' | 'utilisateurs' = 'activites';

  activites: Activite[] = [];
  informations: Information[] = [];
  categories: Category[] = [];
  difficultyLevels: DifficultyLevel[] = [];
  
  activityCategories: Category[] = [];
  informationCategories: Category[] = [];

  showActiviteForm = false;
  newActivite: Partial<Activite> & { categoryId?: number, difficultyLevelId?: number } = {
    title: '',
    description: '',
    content: '',
    image: '',
    isActive: true,
    duree: 15
  };

  showInformationForm = false;
  newInformation: Partial<Information> & { categoryId?: number } = { title: '', content: '', readingTime: 3, isPublished: true };

  showCategoryForm = false;
  newCategory: Partial<Category> = { name: '', type: 'ACTIVITY' };

  activitesSortColumn: string = '';
  activitesSortDirection: 'asc' | 'desc' = 'asc';

  informationsSortColumn: string = '';
  informationsSortDirection: 'asc' | 'desc' = 'asc';

  categoriesSortColumn: string = '';
  categoriesSortDirection: 'asc' | 'desc' = 'asc';

  users: UserResponse[] = [];
  showUserForm = false;
  newUser: Partial<UserResponse> & { password?: string, confirmPassword?: string } = { email: '', firstName: '', lastName: '', password: '', confirmPassword: '' };
  usersSortColumn: string = '';
  usersSortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private activiteService: ActiviteService,
    private informationService: InformationService,
    private categoryService: CategoryService,
    private difficultyService: DifficultyService,
    private userService: UserService,
    private authService: AuthService,
    private contentRefreshService: ContentRefreshService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'informations') this.currentTab = 'informations';
      else if (params['tab'] === 'categories') this.currentTab = 'categories';
      else if (params['tab'] === 'utilisateurs') this.currentTab = 'utilisateurs';
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
    this.loadUsers();
  }

  // --- USERS --- //
  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur chargement utilisateurs', err)
    });
  }

  createUser(): void {
    this.showUserForm = true;
    this.cdr.detectChanges();
  }

  submitUser(): void {
    if (!this.newUser.email || !this.newUser.firstName || !this.newUser.lastName || !this.newUser.password || !this.newUser.confirmPassword) return;

    // Utilise le endpoint /api/v1/auth/register
    const payload = {
      email: this.newUser.email,
      firstName: this.newUser.firstName,
      lastName: this.newUser.lastName,
      password: this.newUser.password,
      confirmPassword: this.newUser.confirmPassword
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.loadUsers();
        this.contentRefreshService.notifyUsersChanged();
        this.cancelUserForm();
        this.notificationService.showSuccess('Utilisateur créé avec succès');
      },
      error: (err) => {
        console.error('Erreur création utilisateur', err);
        this.notificationService.showError(err?.error || 'Erreur lors de la création de l\'utilisateur');
      }
    });
  }

  cancelUserForm(): void {
    this.showUserForm = false;
    this.newUser = { email: '', firstName: '', lastName: '', password: '', confirmPassword: '' };
    this.cdr.detectChanges();
  }

  promoteUser(id: number): void {
    this.userService.promoteToAdmin(id).subscribe({ next: () => { this.loadUsers(); this.notificationService.showSuccess('Utilisateur promu administrateur'); }, error: (err) => { console.error(err); this.notificationService.showError(err?.error || 'Erreur lors de la promotion'); } });
  }

  demoteUser(id: number): void {
    this.userService.demoteFromAdmin(id).subscribe({ next: () => { this.loadUsers(); this.notificationService.showSuccess('Rôle admin retiré'); }, error: (err) => { console.error(err); this.notificationService.showError(err?.error || 'Erreur lors de la modification du rôle'); } });
  }

  toggleUserActive(user: UserResponse): void {
    if (user.isActive) {
      if (!confirm('Êtes-vous sûr de vouloir désactiver ce compte ?')) return;
      this.userService.deactivateUser(user.id).subscribe({ next: () => { this.loadUsers(); this.notificationService.showSuccess('Utilisateur désactivé'); }, error: (err) => { console.error(err); this.notificationService.showError(err?.error || 'Erreur lors de la désactivation'); } });
    } else {
      if (!confirm('Êtes-vous sûr de vouloir réactiver ce compte ?')) return;
      this.userService.reactivateUser(user.id).subscribe({ next: () => { this.loadUsers(); this.notificationService.showSuccess('Utilisateur réactivé'); }, error: (err) => { console.error(err); this.notificationService.showError(err?.error || 'Erreur lors de la réactivation'); } });
    }
  }

  deleteUser(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte utilisateur ?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
          this.contentRefreshService.notifyUsersChanged();
          this.notificationService.showSuccess('Utilisateur supprimé');
        },
        error: (err) => { console.error(err); this.notificationService.showError(err?.error || 'Erreur lors de la suppression de l\'utilisateur'); }
      });
    }
  }

  loadDifficultyLevels(): void {
    this.difficultyService.getAllDifficultyLevels().subscribe(data => {
      this.difficultyLevels = data;
      this.cdr.detectChanges();
    });
  }

  setTab(tab: 'activites' | 'informations' | 'categories' | 'utilisateurs'): void {
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
        this.contentRefreshService.notifyActivitiesChanged();
        this.contentRefreshService.notifyInformationsChanged();
        this.cancelCategoryForm();
        this.notificationService.showSuccess('Catégorie créée');
      },
      error: (err) => {
        console.error('Erreur création catégorie', err);
        this.notificationService.showError(err?.error || 'Erreur lors de la création de la catégorie');
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
        next: () => {
          this.loadCategories();
          this.contentRefreshService.notifyActivitiesChanged();
          this.contentRefreshService.notifyInformationsChanged();
          this.notificationService.showSuccess('Catégorie supprimée');
        },
        error: (err) => { console.error('Erreur suppression catégorie', err); this.notificationService.showError(err?.error || 'Erreur lors de la suppression de la catégorie'); }
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
          this.contentRefreshService.notifyActivitiesChanged();
          this.cancelActiviteForm();
          this.notificationService.showSuccess('Activité mise à jour');
        },
        error: (err) => {
          console.error('Erreur mise à jour activité', err);
          this.notificationService.showError(err?.error || 'Erreur lors de la mise à jour de l\'activité');
        }
      });
    } else {
      this.activiteService.createActivite(payload).subscribe({
        next: () => {
          this.loadActivites();
          this.contentRefreshService.notifyActivitiesChanged();
          this.cancelActiviteForm();
          this.notificationService.showSuccess('Activité créée');
        },
        error: (err) => {
          console.error('Erreur création activité', err);
          this.notificationService.showError(err?.error || 'Erreur lors de la création de l\'activité');
        }
      });
    }
  }

  cancelActiviteForm(): void {
    this.showActiviteForm = false;
    this.newActivite = { title: '', description: '', content: '', image: '', isActive: true, duree: 15 };
    this.cdr.detectChanges();
  }

  editActivite(activite: Activite): void {
    this.newActivite = {
      ...activite,
      categoryId: activite.category?.id,
      difficultyLevelId: activite.difficultyLevel?.id,
      duree: activite.durationMinutes || activite.duree
    };
    this.showActiviteForm = true;
    this.cdr.detectChanges();
  }

  deleteActivite(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
      this.activiteService.deleteActivite(id).subscribe({
        next: () => {
          this.loadActivites();
          this.contentRefreshService.notifyActivitiesChanged();
          this.notificationService.showSuccess('Activité supprimée');
        },
        error: (err) => { console.error('Erreur suppression activité', err); this.notificationService.showError(err?.error || 'Erreur lors de la suppression de l\'activité'); }
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
        this.contentRefreshService.notifyActivitiesChanged();
        this.notificationService.showSuccess('Statut de l\'activité mis à jour');
      },
      error: (err) => { console.error('Erreur mise à jour de l\'état de l\'activité', err); this.notificationService.showError(err?.error || 'Erreur lors de la mise à jour'); }
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
          this.contentRefreshService.notifyInformationsChanged();
          this.cancelInformationForm();
          this.notificationService.showSuccess('Information mise à jour');
        },
        error: (err) => {
          console.error('Erreur mise à jour information', err);
          this.notificationService.showError(err?.error || 'Erreur lors de la mise à jour de l\'information');
        }
      });
    } else {
      this.informationService.createInformation(payload).subscribe({
        next: () => {
          this.loadInformations();
          this.contentRefreshService.notifyInformationsChanged();
          this.cancelInformationForm();
          this.notificationService.showSuccess('Information créée');
        },
        error: (err) => {
          console.error('Erreur création information', err);
          this.notificationService.showError(err?.error || 'Erreur lors de la création de l\'information');
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
        next: () => {
          this.loadInformations();
          this.contentRefreshService.notifyInformationsChanged();
          this.notificationService.showSuccess('Information supprimée');
        },
        error: (err) => { console.error('Erreur suppression information', err); this.notificationService.showError(err?.error || 'Erreur lors de la suppression de l\'information'); }
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
        this.contentRefreshService.notifyInformationsChanged();
        this.notificationService.showSuccess('Statut de l\'information mis à jour');
      },
      error: (err) => { console.error('Erreur mise à jour statut information', err); this.notificationService.showError(err?.error || 'Erreur lors de la mise à jour'); }
    });
  }

  appendContentBlock(target: 'activite' | 'information', block: 'heading' | 'subheading' | 'bullet' | 'image' | 'video'): void {
    const previous = (target === 'activite' ? this.newActivite.content : this.newInformation.content) || '';
    const startWithLineBreak = previous.trim().length > 0 ? '\n\n' : '';

    let textToAppend = '';

    if (block === 'heading') {
      textToAppend = `${startWithLineBreak}## Nouveau chapitre`;
    } else if (block === 'subheading') {
      textToAppend = `${startWithLineBreak}### Sous-section`;
    } else if (block === 'bullet') {
      textToAppend = `${startWithLineBreak}- Point clé 1\n- Point clé 2`;
    } else if (block === 'image') {
      const imageUrl = prompt('URL de l\'image (https://...)');
      if (!imageUrl) {
        return;
      }
      const caption = prompt('Légende (optionnel)') || '';
      textToAppend = `${startWithLineBreak}[image](${imageUrl.trim()})${caption ? ` | ${caption.trim()}` : ''}`;
    } else if (block === 'video') {
      const videoUrl = prompt('URL vidéo YouTube/Vimeo (https://...)');
      if (!videoUrl) {
        return;
      }
      const caption = prompt('Légende (optionnel)') || '';
      textToAppend = `${startWithLineBreak}[video](${videoUrl.trim()})${caption ? ` | ${caption.trim()}` : ''}`;
    }

    if (target === 'activite') {
      this.newActivite = {
        ...this.newActivite,
        content: `${previous}${textToAppend}`
      };
    } else {
      this.newInformation = {
        ...this.newInformation,
        content: `${previous}${textToAppend}`
      };
    }
  }

  sortActivites(column: string) {
    if (this.activitesSortColumn === column) {
      this.activitesSortDirection = this.activitesSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.activitesSortColumn = column;
      this.activitesSortDirection = 'asc';
    }
  }

  sortInformations(column: string) {
    if (this.informationsSortColumn === column) {
      this.informationsSortDirection = this.informationsSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.informationsSortColumn = column;
      this.informationsSortDirection = 'asc';
    }
  }

  sortCategories(column: string) {
    if (this.categoriesSortColumn === column) {
      this.categoriesSortDirection = this.categoriesSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.categoriesSortColumn = column;
      this.categoriesSortDirection = 'asc';
    }
  }

  sortUsers(column: string) {
    if (this.usersSortColumn === column) {
      this.usersSortDirection = this.usersSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.usersSortColumn = column;
      this.usersSortDirection = 'asc';
    }
  }

  private compareValues(a: any, b: any, direction: 'asc' | 'desc') {
    if (a == null && b == null) return 0;
    if (a == null) return direction === 'asc' ? -1 : 1;
    if (b == null) return direction === 'asc' ? 1 : -1;

    if (typeof a === 'number' && typeof b === 'number') {
      return direction === 'asc' ? a - b : b - a;
    }

    const dateA = new Date(a);
    const dateB = new Date(b);
    if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
      return direction === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    }

    const sa = String(a).toLowerCase();
    const sb = String(b).toLowerCase();
    if (sa < sb) return direction === 'asc' ? -1 : 1;
    if (sa > sb) return direction === 'asc' ? 1 : -1;
    return 0;
  }

  get sortedActivites(): Activite[] {
    if (!this.activitesSortColumn) return this.activites;
    const col = this.activitesSortColumn;
    const dir = this.activitesSortDirection;
    return [...this.activites].sort((x, y) => {
      let va: any = null;
      let vb: any = null;
      switch (col) {
        case 'id': va = x.id; vb = y.id; break;
        case 'title': va = x.title; vb = y.title; break;
        case 'categoryId': va = x.category?.name; vb = y.category?.name; break;
        case 'difficultyLevelId': va = x.difficultyLevel?.name; vb = y.difficultyLevel?.name; break;
        case 'durationMinutes': va = x.durationMinutes ?? x.duree; vb = y.durationMinutes ?? y.duree; break;
        case 'isActive': va = x.isActive ? 1 : 0; vb = y.isActive ? 1 : 0; break;
        case 'createdAt': va = x.createdAt; vb = y.createdAt; break;
        default: va = (x as any)[col]; vb = (y as any)[col]; break;
      }
      return this.compareValues(va, vb, dir);
    });
  }

  get sortedInformations(): Information[] {
    if (!this.informationsSortColumn) return this.informations;
    const col = this.informationsSortColumn;
    const dir = this.informationsSortDirection;
    return [...this.informations].sort((a, b) => {
      let va: any = null;
      let vb: any = null;
      switch (col) {
        case 'id': va = a.id; vb = b.id; break;
        case 'title': va = a.title; vb = b.title; break;
        case 'categoryId': va = a.category?.name; vb = b.category?.name; break;
        case 'readingTime': va = a.readingTime; vb = b.readingTime; break;
        case 'isPublished': va = a.isPublished ? 1 : 0; vb = b.isPublished ? 1 : 0; break;
        case 'createdAt': va = a.createdAt; vb = b.createdAt; break;
        default: va = (a as any)[col]; vb = (b as any)[col]; break;
      }
      return this.compareValues(va, vb, dir);
    });
  }

  get sortedCategories(): Category[] {
    if (!this.categoriesSortColumn) return this.categories;
    const col = this.categoriesSortColumn;
    const dir = this.categoriesSortDirection;
    return [...this.categories].sort((a, b) => {
      const va = (a as any)[col];
      const vb = (b as any)[col];
      return this.compareValues(va, vb, dir);
    });
  }

  get sortedUsers(): UserResponse[] {
    if (!this.usersSortColumn) return this.users;
    const col = this.usersSortColumn;
    const dir = this.usersSortDirection;
    return [...this.users].sort((a, b) => {
      let va: any = null;
      let vb: any = null;
      switch (col) {
        case 'id': va = a.id; vb = b.id; break;
        case 'email': va = a.email; vb = b.email; break;
        case 'firstName': va = a.firstName; vb = b.firstName; break;
        case 'lastName': va = a.lastName; vb = b.lastName; break;
        case 'role': va = a.role; vb = b.role; break;
        case 'isActive': va = a.isActive ? 1 : 0; vb = b.isActive ? 1 : 0; break;
        case 'createdAt': va = a.createdAt; vb = b.createdAt; break;
        default: va = (a as any)[col]; vb = (b as any)[col]; break;
      }
      return this.compareValues(va, vb, dir);
    });
  }
}
