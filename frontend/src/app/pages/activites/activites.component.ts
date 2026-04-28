import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-activites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activites.component.html',
  styleUrl: './activites.component.scss'
})
export class ActivitesComponent {
  activites = [
    {
      id: 1,
      nom: 'Yoga relaxant',
      type: 'Yoga',
      duree: 20,
      description: 'Une séance de yoga douce pour détendre corps et esprit',
      difficulte: 1,
      image: '🧘‍♀️',
      isFavorite: false
    },
    {
      id: 2,
      nom: 'Marche méditative',
      type: 'Méditation',
      duree: 30,
      description: 'Une marche consciente pour se reconnecter avec la nature',
      difficulte: 1,
      image: '🚶',
      isFavorite: false
    },
    {
      id: 3,
      nom: 'Musique relaxante',
      type: 'Musique',
      duree: 45,
      description: 'Écoutez de la musique apaisante spécialement sélectionnée',
      difficulte: 1,
      image: '🎵',
      isFavorite: false
    },
    {
      id: 4,
      nom: 'Coloriage anti-stress',
      type: 'Art créatif',
      duree: 25,
      description: 'Exprimer votre créativité par le coloriage',
      difficulte: 1,
      image: '🎨',
      isFavorite: false
    },
    {
      id: 5,
      nom: 'Écriture expressif',
      type: 'Journaling',
      duree: 20,
      description: 'Écrivez sans censure pour libérer vos émotions',
      difficulte: 1,
      image: '✍️',
      isFavorite: false
    },
    {
      id: 6,
      nom: 'Dégustation consciente',
      type: 'Pleine conscience',
      duree: 15,
      description: 'Savourez consciemment une collation ou une boisson',
      difficulte: 1,
      image: '🍵',
      isFavorite: false
    },
    {
      id: 7,
      nom: 'Stretching quotidien',
      type: 'Exercice physique',
      duree: 15,
      description: 'Des étirements simples pour relâcher la tension musculaire',
      difficulte: 1,
      image: '🤸',
      isFavorite: false
    },
    {
      id: 8,
      nom: 'Bain relaxant',
      type: 'Bien-être',
      duree: 30,
      description: 'Prenez un bain chaud pour relaxer vos muscles',
      difficulte: 1,
      image: '🛀',
      isFavorite: false
    }
  ];

  types = ['Tous', 'Yoga', 'Méditation', 'Musique', 'Art créatif', 'Journaling', 'Pleine conscience', 'Exercice physique', 'Bien-être'];
  selectedType = 'Tous';
  sortBy = 'duree';

  get filteredActivites() {
    let filtered = this.activites;

    if (this.selectedType !== 'Tous') {
      filtered = filtered.filter(a => a.type === this.selectedType);
    }

    // Tri
    if (this.sortBy === 'duree') {
      filtered.sort((a, b) => a.duree - b.duree);
    } else if (this.sortBy === 'nom') {
      filtered.sort((a, b) => a.nom.localeCompare(b.nom));
    }

    return filtered;
  }

  filterByType(type: string): void {
    this.selectedType = type;
  }

  toggleFavorite(activite: any): void {
    activite.isFavorite = !activite.isFavorite;
  }

  getDifficulteLabel(niveau: number): string {
    const labels = ['Très facile', 'Facile', 'Moyen', 'Difficile', 'Très difficile'];
    return labels[niveau - 1] || 'Inconnu';
  }
}
