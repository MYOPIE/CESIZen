import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InformationService, Information } from '../../services/information.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-informations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './informations.component.html',
  styleUrl: './informations.component.scss'
})
export class InformationsComponent implements OnInit {
  articles: Information[] = [];

  categories = ['Tous', 'Santé mentale', 'Santé', 'Bien-être'];
  selectedCategories = new Set<string>(['Tous']);
  isAdmin = false;

  constructor(
    private informationService: InformationService,
    private authService: AuthService
  ) {}

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
        
        // Combiner les catégories par défaut avec celles du backend
        const cats = new Set(['Santé mentale', 'Santé', 'Bien-être', ...this.articles.map(a => a.category).filter(c => !!c)]);
        this.categories = ['Tous', ...Array.from(cats)] as string[];
      },
      error: (err) => console.error('Erreur lors du chargement des informations', err)
    });

    this.authService.currentUser$.subscribe(user => {
      this.isAdmin = user?.role === 'ROLE_ADMIN';
    });
  }

  get filteredArticles() {
    if (this.selectedCategories.has('Tous')) {
      return this.articles;
    }
    return this.articles.filter(a => a.category && this.selectedCategories.has(a.category));
  }

  filterByCategory(category: string): void {
    if (category === 'Tous') {
      this.selectedCategories.clear();
      this.selectedCategories.add('Tous');
    } else {
      this.selectedCategories.delete('Tous');
      
      if (this.selectedCategories.has(category)) {
        this.selectedCategories.delete(category);
        if (this.selectedCategories.size === 0) {
          this.selectedCategories.add('Tous');
        }
      } else {
        this.selectedCategories.add(category);
      }
    }
  }
}
