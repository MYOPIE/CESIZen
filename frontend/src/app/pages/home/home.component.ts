import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActiviteService } from '../../services/activite.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  features = [
    {
      icon: '🏥',
      title: 'Diagnostics',
      description: 'Testez votre niveau de stress avec des questionnaires basés sur des échelles reconnues'
    },
    {
      icon: '🧘',
      title: 'Activités de détente',
      description: 'Découvrez des activités adaptées pour gérer votre stress au quotidien'
    },
    {
      icon: '🎯',
      title: 'À venir',
      description: 'Des fonctionnalités supplémentaires pour une expérience encore plus complète !'
    }
  ];

  stats = [
    { label: 'Comptes créés', value: '...' },
    { label: 'Activités disponibles', value: '...' },
    { label: 'Exercices de respiration', value: '...' }
  ];

  constructor(
    private activiteService: ActiviteService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Récupérer le nombre total d'utilisateurs
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        const count = users ? users.length.toString() : '0';
        this.stats = [
          { label: 'Comptes créés', value: count },
          this.stats[1],
          this.stats[2]
        ];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs', err);
        this.stats = [
          { label: 'Comptes créés', value: '-' },
          this.stats[1],
          this.stats[2]
        ];
        this.cdr.detectChanges();
      }
    });

    // Récupérer les activités
    this.activiteService.getActiveActivites().subscribe({
      next: (activites) => {
        const countActivites = activites ? activites.length.toString() : '0';
        
        let respirationCount = 0;
        if (activites) {
          respirationCount = activites.filter(a => 
            a.title?.toLowerCase().includes('respiration') || 
            a.type?.toLowerCase().includes('respiration') ||
            a.description?.toLowerCase().includes('respiration')
          ).length;
        }

        this.stats = [
          this.stats[0],
          { label: 'Activités disponibles', value: countActivites },
          { label: 'Exercices de respiration', value: respirationCount.toString() }
        ];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des activités', err);
        this.stats = [
          this.stats[0],
          { label: 'Activités disponibles', value: '-' },
          { label: 'Exercices de respiration', value: '-' }
        ];
        this.cdr.detectChanges();
      }
    });
  }
}
