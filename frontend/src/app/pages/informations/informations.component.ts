import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-informations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informations.component.html',
  styleUrl: './informations.component.scss'
})
export class InformationsComponent {
  articles = [
    {
      id: 1,
      title: 'Qu\'est-ce que le stress ?',
      category: 'Santé mentale',
      excerpt: 'Le stress est une réaction naturelle de l\'organisme face aux situations perçues comme menaçantes...',
      icon: '🧠',
      readingTime: 5
    },
    {
      id: 2,
      title: 'Les effets du stress chronique',
      category: 'Santé',
      excerpt: 'Lorsque le stress devient persistant, il peut avoir des impacts significatifs sur notre santé...',
      icon: '⚠️',
      readingTime: 7
    },
    {
      id: 3,
      title: 'Techniques de relaxation efficaces',
      category: 'Bien-être',
      excerpt: 'Découvrez les meilleures techniques pour vous détendre et gérer votre stress quotidien...',
      icon: '🧘',
      readingTime: 6
    },
    {
      id: 4,
      title: 'L\'importance du sommeil',
      category: 'Santé',
      excerpt: 'Un bon sommeil est essentiel pour la gestion du stress et le bien-être général...',
      icon: '😴',
      readingTime: 4
    },
    {
      id: 5,
      title: 'Nutrition et gestion du stress',
      category: 'Bien-être',
      excerpt: 'Certains aliments peuvent vous aider à mieux gérer votre stress et vos émotions...',
      icon: '🥗',
      readingTime: 5
    },
    {
      id: 6,
      title: 'Activité physique et santé mentale',
      category: 'Santé',
      excerpt: 'L\'exercice régulier est l\'une des meilleures solutions pour réduire le stress...',
      icon: '🏃',
      readingTime: 6
    }
  ];

  categories = ['Tous', 'Santé mentale', 'Santé', 'Bien-être'];
  selectedCategory = 'Tous';

  get filteredArticles() {
    if (this.selectedCategory === 'Tous') {
      return this.articles;
    }
    return this.articles.filter(a => a.category === this.selectedCategory);
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
  }
}
