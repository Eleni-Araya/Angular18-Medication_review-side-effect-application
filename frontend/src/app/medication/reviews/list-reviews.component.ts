import { Component, effect, inject, input, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';

import { MedicationService } from '../medication.service';
import { AuthService } from '../../auth/auth.service';
import { Image, Medication, Owner, Review } from '../medication.type';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-list-reviews',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="container">
      @for(review of $userReviews(); track review){
      <mat-card appearance="outlined">
        <mat-card-content>
          <li class="review-item">
            <div class="displaying">
              <span class="review-text">
                Reviewd by {{ review.by.fullname }} : {{ review.review }}
              </span>
              <span>
                @for(stars of generateStars(review.rating); track $index){
                <mat-icon
                  aria-hidden="false"
                  fontIcon="star"
                  class="star"
                ></mat-icon>
                }
              </span>
            </div>

            @if(authService.is_logged_in()&&
            (review.by.user_id===authService.state$()._id)){
            <div class="button-container">
              <button
                class="editButton"
                mat-icon-button
                aria-label="Edit"
                (click)="goToEdit(review._id)"
              >
                <mat-icon>edit</mat-icon>
              </button>

              <button
                (click)="deleteReview(review._id)"
                class="deleteButton"
                mat-icon-button
                color="primary"
                aria-label="Example icon button with a delete icon"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </div>
            }
          </li>
        </mat-card-content>
      </mat-card>
      }@empty {
      <h5>No reviews for this item!</h5>
      }
    </div>
  `,
  styles: `
.mat-card {
  width: 100%;
}li.container {
  display: flex;
  justify-content: space-between
}mat-card {
  margin-bottom: 16px; 
}.container {
  padding:16px;
  gap:80px
  display: flex;
  flex-direction: column
}.button-container {
  display: flex;
  gap: 8px; 
}
.editButton, .deleteButton {
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
}.review-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
}.star{
  color:gold;
}.review-text {
  flex-grow: 1;
  margin-right: 16px; 
}.displaying{
  display:flex;
  flex-direction:column;
  gap:8px;
}
  `,
})
export class ListReviewsComponent {
  readonly #medicationService = inject(MedicationService);
  readonly authService = inject(AuthService);
  readonly #notification = inject(ToastrService);
  readonly #router = inject(Router);

  $userReviews = signal<Review[]>([]);
  medication_id = input<string>('');
  _id = input<string>('');

  generateStars(rating: number): number[] {
    return Array.from({ length: rating });
  }

  image: Image = { _id: '', filename: '', originalname: '' };

  owner: Owner = {
    user_id: this.authService.state$()._id,
    fullname: this.authService.state$().fullname,
    email: this.authService.state$().email,
  };

  review: Review[] = [];

  medication: Medication = {
    _id: '',
    name: '',
    first_letter: '',
    generic_name: '',
    medication_class: '',
    availability: 'Prescription',
    image: this.image,
    added_by: this.owner,
    reviews: this.review,
  };

  constructor() {
    effect(() => {
      this.getReviewsByMedID();
    });
  }

  getReviewsByMedID() {
    this.#medicationService
      .getReviews(this.medication_id())
      .subscribe((response) => {
        if (response.success) {
          this.$userReviews.set(response.data);
        }
      });
  }

  goToEdit(_id: string) {
    this.#router.navigate([
      '',
      'medications',
      'reviews',
      'update',
      this.medication_id(),
      _id,
    ]);
  }

  deleteReview(_id: string) {
    const confirmation = confirm('delete review?');
    if (confirmation) {
      this.#medicationService
        .deleteReview(this.medication_id(), _id)
        .subscribe((response) => {
          if (response.success) {
            this.#notification.success(`Review deleted`);
            this.$userReviews.update((oldReview) =>
              oldReview.filter((review) => review._id !== _id)
            );
            this.#router.navigate([
              '',
              'medications',
              'reviews',
              'list',
              this.medication_id(),
            ]);
          }
        });
    }
  }
}
