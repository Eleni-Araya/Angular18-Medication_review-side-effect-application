import { Component, effect, inject, input, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';

import { MedicationService } from './medication.service';
import { Medication, Image, Owner, Review } from './medication.type';
import { AuthService } from '../auth/auth.service';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-medication-detail',
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
    <mat-card>
      <mat-card-content>
        <p>Generic Name: {{ medication().generic_name }}</p>
        <p>Medication class: {{ medication().medication_class }}</p>
        <p>Availabe at: {{ medication().availability }}</p>
        <p>owner: {{ medication().added_by.fullname }}</p>
        @if(medication().image._id){
        <img
          width="100"
          src="http://localhost:3000/medications/images/{{
            medication().image._id
          }}"
        />
        }
        <mat-card-actions>
          @if(authService.is_logged_in()&& (authService.state$()._id===
          medication().added_by.user_id)){
          <button (click)="updateHandler(medication()._id)">Update</button>
          <button (click)="deleteHandler(medication()._id)">Delete</button>
          } @if(authService.is_logged_in()){
          <button (click)="addReviewHandler(medication()._id)">
            Add Review
          </button>
          }
          <button (click)="showReview(medication()._id)">Show Review</button>
        </mat-card-actions>
      </mat-card-content>
    </mat-card>
  `,
  styles: `mat-card {
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
}button {
  width: 20%;
  padding: 10px;
  margin: 8px
}.button-container {
  display: flex;
  gap: 5px; 
}.deleteButton{
  width:50px;
  height:30px
}.editButton{
  color: #3f51b5; 
  width:50px;
  height:50px;
  transition: none;
}
`,
})
export class MedicationDetailComponent {
  readonly #medicationService = inject(MedicationService);
  readonly authService = inject(AuthService);
  readonly #notification = inject(ToastrService);
  readonly #router = inject(Router);
  readonly title = inject(Title);

  $userReviews = signal<Review[]>([]);

  $medications = signal<Medication[]>([]);

  medication_id = input<string>('');
  _id = input<string>('');

  image: Image = { _id: '', filename: '', originalname: '' };

  owner: Owner = {
    user_id: this.authService.state$()._id,
    fullname: this.authService.state$().fullname,
    email: this.authService.state$().email,
  };

  review: Review[] = [];

  medication = signal<Medication>({
    _id: '',
    name: '',
    first_letter: '',
    generic_name: '',
    medication_class: '',
    availability: 'Prescription',
    image: this.image,
    added_by: this.owner,
    reviews: this.review,
  });

  constructor() {
    effect(() => {
      this.med();
    });
  }

  med() {
    if (this.medication_id() !== '') {
      this.#medicationService
        .getMedicationById(this.medication_id())
        .subscribe((response) => {
          this.medication.set(response.data);
          this.title.setTitle(`name : ${response.data.name}`);
        });
    }
  }

  updateHandler(med_id: string) {
    this.#router.navigate(['medications', 'update', med_id]);
  }

  deleteHandler(med_id: string) {
    this.#medicationService
      .deleteMedicationById(med_id)
      .subscribe((response) => {
        if (response.data) {
          this.#notification.success('Deleted Sucessfully');
          this.$medications.update((old_meds) =>
            old_meds.filter((med) => med._id !== med_id)
          );
        }
      });
    this.#router.navigate(['medications', 'list']);
  }

  addReviewHandler(med_id: string) {
    this.#router.navigate(['medications', 'reviews', 'add', med_id]);
  }

  showReview(med_id: string) {
    this.#router.navigate([
      '',
      'medications',
      'reviews',
      'list',
      this.medication_id(),
    ]);
  }
}
