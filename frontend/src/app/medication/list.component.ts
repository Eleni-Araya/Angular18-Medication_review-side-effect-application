import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MedicationService } from './medication.service';
import { Medication } from './medication.type';

import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [RouterLink, MatButtonToggleModule],
  template: `
    <div class="button-container">
      @for( letters of upperCaseAlphabets; track letters){
      <mat-button-toggle-group class="button-group">
        <div class="example-button-row">
          <button
            mat-stroked-button
            color="primary"
            (click)="getMedicationByFirstLetter(letters)"
          >
            {{ letters }}
          </button>
        </div>
      </mat-button-toggle-group>
      }
    </div>

    @for(med of medications(); track med._id){
    <li>
      <a [routerLink]="['', 'medications', med._id]">{{ med.name }}</a>
    </li>
    }@empty {
    <p>No medicine to display!</p>
    }
  `,
  styles: `
  .button-container {
  display: flex;
  justify-content: center;
  border: 2px solid; 
  border-radius: 8px; 
  margin:0 16px;
}.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px; 
  margin:16px;
  padding:1px
}
`,
})
export class ListComponent {
  readonly medicationService = inject(MedicationService);
  medications = signal<Medication[]>([]);
  upperCaseAlphabets: string[] = [];

  constructor() {
    this.upperCaseAlphabets = this.generateAlphabets(65, 90);
    effect(() => this.getListOfMeds());
  }
  getListOfMeds() {
    this.medicationService.getMedications$.subscribe((response) => {
      this.medications.set(response.data);
    });
  }

  generateAlphabets(start: number, end: number): string[] {
    const alphabets = [];
    for (let i = start; i <= end; i++) {
      alphabets.push(String.fromCharCode(i));
    }
    return alphabets;
  }

  getMedicationByFirstLetter(first_letter: string) {
    this.medicationService
      .getMedicationByFirstLetter(first_letter)
      .subscribe((response) => {
        this.medications.set(response.data);
        console.log(response.data);
      });
  }
}
