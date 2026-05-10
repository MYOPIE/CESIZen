import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActiviteService, Activite } from '../../services/activite.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-activites',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './activites.component.html',
  styleUrl: './activites.component.scss'
})
export class ActivitesComponent implements OnInit {
  activites: Activite[] = [];

  types = ['Tous', 'Yoga', 'Méditation', 'Musique', 'Art créatif', 'Journaling', 'Pleine conscience', 'Exercice physique', 'Bien-être'];
  selectedTypes = new Set<string>(['Tous']);
  sortBy = 'duree';
  
  isLoggedIn = false;
  isAdmin = false;

  constructor(
    private activiteService: ActiviteService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.activiteService.getActiveActivites().subscribe({
      next: (data) => {
        // Adapter les données du backend si nécessaire
        this.activites = data.map(a => ({
          ...a,
          type: a.type || 'Bien-être', // Valeur par défaut si manquante
          duree: a.duree || 15,
          difficulte: a.difficulte || 1,
          image: a.image || '✨',
          isFavorite: false // À récupérer depuis les favoris de l'utilisateur plus tard
        }));
        
        // Ajouter dynamiquement de nouveaux types depuis le backend s'ils n'existent pas
        const allTypes = new Set(['Yoga', 'Méditation', 'Musique', 'Art créatif', 'Journaling', 'Pleine conscience', 'Exercice physique', 'Bien-être', ...this.activites.map(a => a.type).filter(t => !!t)]);
        this.types = ['Tous', ...Array.from(allTypes)] as string[];
      },
      error: (err) => console.error('Erreur lors du chargement des activités', err)
    });

    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === 'ROLE_ADMIN';
    });
  }

  get filteredActivites() {
    let filtered = this.activites;

    if (!this.selectedTypes.has('Tous')) {
      filtered = filtered.filter(a => a.type && this.selectedTypes.has(a.type));
    }

    // Tri
    if (this.sortBy === 'duree') {
      filtered.sort((a, b) => (a.duree || 0) - (b.duree || 0));
    } else if (this.sortBy === 'nom') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }

  filterByType(type: string): void {
    if (type === 'Tous') {
      this.selectedTypes.clear();
      this.selectedTypes.add('Tous');
    } else {
      this.selectedTypes.delete('Tous'); // Supprimer "Tous" si un type spécifique est cliqué
      
      if (this.selectedTypes.has(type)) {
        this.selectedTypes.delete(type);
        // Si vide, revenir à "Tous"
        if (this.selectedTypes.size === 0) {
          this.selectedTypes.add('Tous');
        }
      } else {
        this.selectedTypes.add(type);
      }
    }
  }

  toggleFavorite(activite: any): void {
    if (!this.isLoggedIn) return;
    activite.isFavorite = !activite.isFavorite;
  }

  getDifficulteLabel(niveau: number | undefined): string {
    if (niveau === undefined) return 'Inconnu';
    const labels = ['Très facile', 'Facile', 'Moyen', 'Difficile', 'Très difficile'];
    return labels[niveau - 1] || 'Inconnu';
  }
}
