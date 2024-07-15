import { Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { debounceTime, mergeMap } from 'rxjs/operators';

import { MedicationService } from './medication.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-update-medication',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="updateMed()" class="med-form">
      <mat-form-field>
        <input placeholder="name" formControlName="name" required matInput />
      </mat-form-field>
      <mat-form-field>
        <input
          placeholder="generic_name"
          formControlName="generic_name"
          required
          matInput
        />
      </mat-form-field>
      <mat-form-field>
        <input
          placeholder="medication_class"
          formControlName="medication_class"
          required
          matInput
        />
      </mat-form-field>
      <mat-form-field>
        <input
          placeholder="availability"
          formControlName="availability"
          required
          matInput
        />
      </mat-form-field>
      <input
        type="file"
        formControlName="medication_image"
        (change)="setFile($event)"
      />
      <button type="submit">Submit</button>
    </form>
  `,
  styles: ` 
  .med-form {
  max-width: 400px; 
  margin: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px; 
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}.mat-input-element {
  font-size: 16px;
  height:500px; 
}.med-form mat-form-field {
  width: 100%;
}.mat-form-field-appearance-fill .mat-form-field-flex {
  border-radius: 8px; 
}.med-form button {
  align-self: flex-end;
}
   `,
})
export class UpdateMedicationComponent {
  readonly #medicationService = inject(MedicationService);
  readonly #notification = inject(ToastrService);
  readonly #router = inject(Router);

  medication_id = input<string>('');

  form = inject(FormBuilder).nonNullable.group({
    _id: '',
    name: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'blur',
      },
    ],
    generic_name: ['', Validators.required],
    medication_class: ['', Validators.required],
    availability: ['', Validators.required],
    medication_image: ['', Validators.required],
  });

  file!: File;

  setFile(event: Event) {
    console.log('this is setFile', event);
    this.file = (event.target as HTMLInputElement).files![0];
  }

  get name() {
    return this.form.controls.name;
  }

  nameExist = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.medication_id() !== '') {
        this.#medicationService
          .getMedicationById(this.medication_id())
          .subscribe((response) => {
            this.form.patchValue(response.data);
          });
      }
      this.name.valueChanges
        .pipe(
          debounceTime(1000),
          mergeMap((name) => this.#medicationService.getMedicationByName(name))
        )
        .subscribe((response) => {
          console.log('???', response);
          this.nameExist.set(response.data);
        });
    });
  }

  updateMed() {
    const formData = new FormData();
    formData.append('name', this.form.value.name!);
    formData.append('generic_name', this.form.value.generic_name!);
    formData.append('medication_class', this.form.value.generic_name!);
    formData.append('availability', this.form.value.availability!);
    formData.append('medication_image', this.file);

    if (!this.nameExist()) {
      this.#medicationService
        .updateMedication(formData, this.medication_id())
        .subscribe((response) => {
          if (response.success) {
            this.#notification.success('updated Successfully');
            this.#router.navigate(['', 'medications', 'list']);
          } else {
            this.#notification.success('something went wrong');
          }
        });
    } else {
      this.#notification.error(`Medicine name already exist`);
    }
  }
}
