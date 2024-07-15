import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MedicationService } from './medication.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Medication } from './medication.type';
import { Observable } from 'rxjs';
import { debounceTime, mergeMap } from 'rxjs/operators';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-medication',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="addMed()" class="med-form">
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

      <input type="file" formControlName="images" (change)="setFile($event)" />

      <button type="submit" [disabled]="form.invalid">Submit</button>
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
export class AddMedicationComponent {
  readonly medicationService = inject(MedicationService);
  readonly #notification = inject(ToastrService);
  readonly #router = inject(Router);

  form = inject(FormBuilder).nonNullable.group({
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
    images: [''],
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
      this.name.valueChanges
        .pipe(
          debounceTime(1000),
          mergeMap((name) => this.medicationService.getMedicationByName(name))
        )
        .subscribe((response) => {
          this.nameExist.set(response.data);
        });
    });
  }

  addMed() {
    const formData = new FormData();
    formData.append('name', this.form.value.name!);
    formData.append('generic_name', this.form.value.generic_name!);
    formData.append('medication_class', this.form.value.generic_name!);
    formData.append('availability', this.form.value.availability!);
    formData.append('medication_image', this.file);

    if (!this.nameExist()) {
      this.medicationService.addMedication(formData).subscribe((response) => {
        if (response.success) {
          this.#notification.success(`Medicine is added successfully`);
          this.#router.navigate(['', 'medications', 'list']);
        } else {
          this.#notification.error(`Something went wrong`);
        }
      });
    } else {
      this.#notification.error(`Medicine name already exist`);
    }
  }
}
