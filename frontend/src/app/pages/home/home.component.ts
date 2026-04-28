import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  features = [
    {
      icon: '🏥',
      title: 'Diagnostics',
      description: 'Testez votre niveau de stress avec des questionnaires basés sur des échelles reconnues'
    },
    {
      icon: '🧘',
      title: 'Exercices de respiration',
      description: 'Apprenez des techniques de respiration et cohérence cardiaque pour vous détendre'
    },
    {
      icon: '🎯',
      title: 'Activités de détente',
      description: 'Découvrez des activités adaptées pour gérer votre stress au quotidien'
    },
    {
      icon: '📊',
      title: 'Tracker d\'émotions',
      description: 'Suivez vos émotions et identifiez les patterns de votre bien-être'
    }
  ];

  stats = [
    { label: 'Utilisateurs actifs', value: '10K+' },
    { label: 'Activités disponibles', value: '50+' },
    { label: 'Exercices de respiration', value: '12' },
    { label: 'Score de satisfaction', value: '4.8/5' }
  ];
}
