import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActiviteService, Activite } from '../../services/activite.service';
import { InformationService, Information } from '../../services/information.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  currentTab: 'activites' | 'informations' = 'activites';

  activites: Activite[] = [];
  informations: Information[] = [];

  constructor(
    private activiteService: ActiviteService,
    private informationService: InformationService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'informations') {
        this.currentTab = 'informations';
      } else if (params['tab'] === 'activites') {
        this.currentTab = 'activites';
      }
    });

    // Vérifier si l'utilisateur est admin
    this.authService.currentUser$.subscribe(user => {
      // Pour l'instant, on vérifie juste si c'est renseigné ROLE_ADMIN. 
      // Adaptez cette vérification selon comment le rôle est retourné.
      if (!user || user.role !== 'ROLE_ADMIN') {
        // Rediriger si non admin (à décommenter quand l'auth sera robuste)
        // this.router.navigate(['/']);
      }
    });

    this.loadActivites();
    this.loadInformations();
  }

  setTab(tab: 'activites' | 'informations'): void {
    this.currentTab = tab;
  }

  // --- ACTIVITES --- //
  loadActivites(): void {
    this.activiteService.getAllActivites().subscribe({
      next: (data) => this.activites = data,
      error: (err) => console.error('Erreur chargement activités', err)
    });
  }

  createActivite(): void {
    // Placeholder - à transformer en ouverture de modal
    alert('Création d\'activité (Bientôt disponible)');
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
      next: () => this.loadActivites(),
      error: (err) => console.error('Erreur mise à jour de l\'état de l\'activité', err)
    });
  }

  // --- INFORMATIONS --- //
  loadInformations(): void {
    this.informationService.getAllInformations().subscribe({
      next: (data) => this.informations = data,
      error: (err) => console.error('Erreur chargement informations', err)
    });
  }

  createInformation(): void {
    alert('Création d\'information (Bientôt disponible)');
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
      next: () => this.loadInformations(),
      error: (err) => console.error('Erreur mise à jour statut information', err)
    });
  }
}
