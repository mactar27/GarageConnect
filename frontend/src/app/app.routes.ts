import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Overview } from './pages/dashboard/overview/overview';
import { Reparations } from './pages/dashboard/reparations/reparations';
import { Calendrier } from './pages/dashboard/calendrier/calendrier';
import { Paiements } from './pages/dashboard/paiements/paiements';
import { NouvelleDemande } from './pages/dashboard/nouvelle-demande/nouvelle-demande';
import { Garages } from './pages/dashboard/admin/garages/garages';
import { Stats } from './pages/dashboard/admin/stats/stats';
import { MonGarage } from './pages/dashboard/responsable/mon-garage/mon-garage';
import { Mecaniciens } from './pages/dashboard/responsable/mecaniciens/mecaniciens';
import { DemandesGarage } from './pages/dashboard/responsable/demandes-garage/demandes-garage';
import { Interventions } from './pages/dashboard/mecanicien/interventions/interventions';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { 
    path: 'dashboard', 
    component: Dashboard,
    children: [
      { path: '', component: Overview },
      
      // Client
      { path: 'reparations', component: Reparations, canActivate: [RoleGuard], data: { expectedRoles: ['CLIENT'] } },
      { path: 'calendrier', component: Calendrier, canActivate: [RoleGuard], data: { expectedRoles: ['CLIENT'] } },
      { path: 'paiements', component: Paiements, canActivate: [RoleGuard], data: { expectedRoles: ['CLIENT'] } },
      { path: 'nouvelle-demande', component: NouvelleDemande, canActivate: [RoleGuard], data: { expectedRoles: ['CLIENT'] } },
      
      // Admin
      { path: 'admin/garages', component: Garages, canActivate: [RoleGuard], data: { expectedRoles: ['ADMIN'] } },
      { path: 'admin/stats', component: Stats, canActivate: [RoleGuard], data: { expectedRoles: ['ADMIN'] } },
      
      // Responsable
      { path: 'responsable/mon-garage', component: MonGarage, canActivate: [RoleGuard], data: { expectedRoles: ['RESPONSABLE_GARAGE'] } },
      { path: 'responsable/mecaniciens', component: Mecaniciens, canActivate: [RoleGuard], data: { expectedRoles: ['RESPONSABLE_GARAGE'] } },
      { path: 'responsable/demandes', component: DemandesGarage, canActivate: [RoleGuard], data: { expectedRoles: ['RESPONSABLE_GARAGE'] } },
      
      // Mecanicien
      { path: 'mecanicien/interventions', component: Interventions, canActivate: [RoleGuard], data: { expectedRoles: ['MECANICIEN'] } }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
