import { Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgStyle } from '@angular/common';

import { MedicationService } from '../medication.service';
import { Review } from '../medication.type';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-update-review',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgStyle,
  ],
  template: `
    <br />
    <div class="container">
      <form [formGroup]="form">
        <mat-form-field hintLabel="Max 10 characters">
          <input
            matInput
            #input
            maxlength="100"
            placeholder="update review"
            formControlName="review"
          />
          <mat-hint align="end">{{ value().length }}/100</mat-hint>
        </mat-form-field>
        <br />
        <mat-form-field>
          <mat-label>Rating</mat-label>
          <mat-select
            formControlName="rating"
            [(value)]="form.controls.rating.value"
          >
            <mat-option [value]="5">5</mat-option>
            <mat-option [value]="4">4</mat-option>
            <mat-option [value]="3">3</mat-option>
            <mat-option [value]="2">2</mat-option>
            <mat-option [value]="1">1</mat-option>
          </mat-select>
          <mat-hint align="end"></mat-hint>
        </mat-form-field>
      </form>
    </div>
    <div class="container">
      <button (click)="onBack()">Back</button>&nbsp;
      <button (click)="onSave()" [disabled]="form.invalid">update</button>&nbsp;
    </div>
  `,
  styles: `
  .container{
    display:flex;
    justify-content:center;
    align-items:center;
    margin-top:20px
  }
  `,
})
export class UpdateReviewComponent {
  readonly #medicationService = inject(MedicationService);
  #router = inject(Router);
  #notification = inject(ToastrService);

  _id = input<string>('');
  medication_id = input<string>('');

  form = inject(FormBuilder).nonNullable.group({
    review: ['', Validators.required],
    rating: [0, Validators.required],
  });

  protected readonly value = signal('');

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }

  constructor() {
    effect(() => {
      if (this._id()) {
        this.#medicationService
          .getReviewByID(this.medication_id(), this._id())
          .subscribe((response) => {
            this.form.patchValue(response.data);
          });
      }
    });
  }

  onSave() {
    const confirmation = confirm('save changes?');
    if (confirmation && this._id()) {
      this.#medicationService
        .updateReview(
          this.form.value as Review,
          this.medication_id(),
          this._id()
        )
        .subscribe((response) => {
          if (response.success) {
            this.#notification.success(`Review updated`);
            this.#router.navigate(['', 'medications', 'list']);
          } else {
            this.#notification.error(`Failed updating review`);
          }
        });
    }
  }

  onBack() {
    this.#router.navigate(['', 'medications', 'list']);
    this.#notification.warning(`no updates made `);
  }
}
