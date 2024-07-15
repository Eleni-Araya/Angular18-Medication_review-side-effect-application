import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ListComponent } from './list.component';

export const medication_routes: Routes = [
  {
    path: 'list',
    // loadComponent: () =>
    //   import('./list.component').then((c) => c.ListComponent),
    component: ListComponent,
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./add-medication.component').then(
        (c) => c.AddMedicationComponent
      ),
    canActivate: [() => inject(AuthService).is_logged_in()],
  },

  {
    path: 'update/:medication_id',
    loadComponent: () =>
      import('./update-medication.component').then(
        (c) => c.UpdateMedicationComponent
      ),
    canActivate: [() => inject(AuthService).is_logged_in()],
  },
  {
    path: ':medication_id',
    loadComponent: () =>
      import('./medication-detail.component').then(
        (c) => c.MedicationDetailComponent
      ),
  },
  {
    path: 'reviews',
    loadChildren: () =>
      import('./reviews/review.routes').then((r) => r.review_routes),
  },
  {
    path: '**',
    redirectTo: 'list',
  },
];
