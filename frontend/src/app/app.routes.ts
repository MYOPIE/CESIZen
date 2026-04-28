import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CompteComponent } from './pages/compte/compte.component';
import { InformationsComponent } from './pages/informations/informations.component';
import { ActivitesComponent } from './pages/activites/activites.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'informations', component: InformationsComponent },
  { path: 'activites', component: ActivitesComponent },
  { path: 'compte', component: CompteComponent },
  { path: '**', redirectTo: '' }
];
