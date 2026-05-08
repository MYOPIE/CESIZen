import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformationService, Information } from '../../services/information.service';

@Component({
  selector: 'app-informations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informations.component.html',
  styleUrl: './informations.component.scss'
})
export class InformationsComponent implements OnInit {
  articles: Information[] = [];

  categories = ['Tous', 'Santé mentale', 'Santé', 'Bien-être'];
  selectedCategory = 'Tous';

  constructor(private informationService: InformationService) {}

  ngOnInit(): void {
    this.informationService.getPublishedInformations().subscribe({
      next: (data) => {
        this.articles = data.map(a => ({
          ...a,
          category: a.category || 'Bien-être',
          excerpt: a.excerpt || (a.content ? a.content.substring(0, 100) + '...' : ''),
          icon: a.icon || '📝',
          readingTime: a.readingTime || Math.max(1, Math.ceil((a.content?.length || 0) / 1000))
        }));
        
        // Combine default categories with any new ones from the backend
        const cats = new Set(['Santé mentale', 'Santé', 'Bien-être', ...this.articles.map(a => a.category).filter(c => !!c)]);
        this.categories = ['Tous', ...Array.from(cats)] as string[];
      },
      error: (err) => console.error('Erreur lors du chargement des informations', err)
    });
  }

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
