import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CompteComponent } from './pages/compte/compte.component';
import { InformationsComponent } from './pages/informations/informations.component';
import { ActivitesComponent } from './pages/activites/activites.component';
import { ActiviteDetailComponent } from './pages/activite-detail/activite-detail.component';
import { InformationDetailComponent } from './pages/information-detail/information-detail.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'informations', component: InformationsComponent },
  { path: 'informations/:id', component: InformationDetailComponent },
  { path: 'activites', component: ActivitesComponent },
  { path: 'activites/:id', component: ActiviteDetailComponent },
  { path: 'compte', component: CompteComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];
