import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { MedicationService } from '../medication.service';
import { AuthService } from '../../auth/auth.service';
import { Review } from '../medication.type';

import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatRadioModule,
  ],
  template: `
    <mat-card class="review-card">
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="addReview()">
          <textarea
            placeholder="Write your review..."
            formControlName="review"
            required
            rows="5"
            cols="50"
            class="review-textarea"
          ></textarea
          ><br />
          <form [formGroup]="form">
            <section class="rating-section">
              <label class="rating-label">Rating:</label>
              <mat-radio-group formControlName="rating" class="rating-group">
                <mat-radio-button class="rating-button" value="1"
                  >1</mat-radio-button
                >
                <mat-radio-button class="rating-button" value="2"
                  >2</mat-radio-button
                >
                <mat-radio-button class="rating-button" value="3"
                  >3</mat-radio-button
                >
                <mat-radio-button class="rating-button" value="4"
                  >4</mat-radio-button
                >
                <mat-radio-button class="rating-button" value="5"
                  >5</mat-radio-button
                >
              </mat-radio-group>
            </section>
          </form>

          <button
            type="submit"
            mat-raised-button
            color="primary"
            class="submit-button"
          >
            Submit
          </button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
.review-card {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}.review-textarea {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 16px;
  resize: vertical;
  margin-bottom: 20px;
}.rating-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}.rating-label {
  margin-right: 10px;
  font-weight: bold;
}.rating-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
}.rating-button {
  margin: 0 5px;
}.submit-button {
  display: block;
  margin: 0 auto;
}
`,
})
export class AddReviewComponent {
  readonly #medicationService = inject(MedicationService);
  readonly authService = inject(AuthService);
  readonly #notification = inject(ToastrService);
  readonly #router = inject(Router);

  labelPosition = signal<'before' | 'after'>('after');

  medication_id = input<string>('');

  form = inject(FormBuilder).nonNullable.group({
    review: ['', Validators.required],
    rating: [5],
  });

  addReview() {
    this.#medicationService
      .addReview(this.medication_id(), this.form.value as Review)
      .subscribe((response) => {
        if (response.data) {
          this.#notification.success('review added successfully');
          this.#router.navigate(['', 'medications', 'list']);
        } else {
          this.#notification.success('something went wrong');
        }
      });
  }
}
