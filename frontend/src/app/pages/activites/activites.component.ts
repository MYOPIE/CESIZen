import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActiviteService, Activite } from '../../services/activite.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-activites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activites.component.html',
  styleUrl: './activites.component.scss'
})
export class ActivitesComponent implements OnInit {
  activites: Activite[] = [];

  types = ['Tous', 'Yoga', 'Méditation', 'Musique', 'Art créatif', 'Journaling', 'Pleine conscience', 'Exercice physique', 'Bien-être'];
  selectedType = 'Tous';
  sortBy = 'duree';
  
  isLoggedIn = false;

  constructor(
    private activiteService: ActiviteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.activiteService.getActiveActivites().subscribe({
      next: (data) => {
        // Adapt backend data if needed
        this.activites = data.map(a => ({
          ...a,
          type: a.type || 'Bien-être', // Default if missing
          duree: a.duree || 15,
          difficulte: a.difficulte || 1,
          image: a.image || '✨',
          isFavorite: false // To fetch from user's favorites later
        }));
      },
      error: (err) => console.error('Erreur lors du chargement des activités', err)
    });

    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  get filteredActivites() {
    let filtered = this.activites;

    if (this.selectedType !== 'Tous') {
      filtered = filtered.filter(a => a.type === this.selectedType);
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
    this.selectedType = type;
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
