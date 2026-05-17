import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActiviteService } from '../../services/activite.service';
import { AuthService } from '../../services/auth.service';
import { InformationService } from '../../services/information.service';

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
    { label: 'Informations en ligne', value: '...' }
  ];

  constructor(
    private activiteService: ActiviteService,
    private authService: AuthService,
    private informationService: InformationService,
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
        
        this.stats = [
          this.stats[0],
          { label: 'Activités disponibles', value: countActivites },
          this.stats[2]
        ];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des activités', err);
        this.stats = [
          this.stats[0],
          { label: 'Activités disponibles', value: '-' },
          this.stats[2]
        ];
        this.cdr.detectChanges();
      }
    });

    // Récupérer les informations
    this.informationService.getPublishedInformations().subscribe({
      next: (infos) => {
        const countInfos = infos ? infos.length.toString() : '0';
        
        this.stats = [
          this.stats[0],
          this.stats[1],
          { label: 'Informations en ligne', value: countInfos }
        ];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des informations', err);
        this.stats = [
          this.stats[0],
          this.stats[1],
          { label: 'Informations en ligne', value: '-' }
        ];
        this.cdr.detectChanges();
      }
    });
  }
}
