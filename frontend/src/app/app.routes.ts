import { Routes } from '@angular/router';

import { ListComponent } from './medication/list.component';

export const routes: Routes = [
  { path: '', component: ListComponent, pathMatch: 'full' },
  {
    path: 'signin',
    loadComponent: () =>
      import('./auth/signin.component').then((c) => c.SigninComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./auth/signup.component').then((c) => c.SignupComponent),
  },

  {
    path: 'medications',
    loadChildren: () =>
      import('./medication/medication.routes').then((r) => r.medication_routes),
  },
  { path: '**', redirectTo: '' },
];
