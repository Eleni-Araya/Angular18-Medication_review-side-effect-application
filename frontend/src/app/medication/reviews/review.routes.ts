import { Routes } from '@angular/router';

export const review_routes: Routes = [
  {
    path: 'add/:medication_id',
    loadComponent: () =>
      import('./add-review.component').then((c) => c.AddReviewComponent),
  },

  {
    path: 'update/:medication_id/:_id',
    loadComponent: () =>
      import('./update-review.component').then((c) => c.UpdateReviewComponent),
  },

  {
    path: 'list/:medication_id',
    loadComponent: () =>
      import('./list-reviews.component').then((c) => c.ListReviewsComponent),
  },
];
