import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { User } from './user.type';
import { Router } from '@angular/router';
import { MyErrorStateMatcher } from './signupError';

import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <form class="example-form" [formGroup]="form" (submit)="submit()">
      <mat-card>
        <mat-card-title>Signup Form</mat-card-title>
        <mat-card-content>
          <mat-form-field class="example-full-width">
            <mat-label>Full Name</mat-label>
            <input
              matInput
              formControlName="fullname"
              placeholder="Full Name"
            />
          </mat-form-field>
          <mat-form-field class="example-full-width">
            <mat-label>Email</mat-label>
            <input
              type="email"
              matInput
              formControlName="email"
              [errorStateMatcher]="matcher"
              placeholder="Ex. pat@example.com"
            />
            <mat-hint>Enter a valid email!</mat-hint>
            @if (form.hasError('email') && !form.hasError('required')) {
            <mat-error> Please enter a valid email address </mat-error>
            }@if (form.hasError('required')) {
            <mat-error>Email is <strong>required</strong></mat-error>
            }
          </mat-form-field>
          <mat-form-field class="example-full-width">
            <mat-label>Password</mat-label>
            <input
              type="password"
              matInput
              formControlName="password"
              placeholder="Password"
            />
          </mat-form-field>
        </mat-card-content>
        <mat-card-actions>
          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="form.invalid"
          >
            Submit
          </button>
        </mat-card-actions>
      </mat-card>
    </form>
  `,
  styles: `
  .example-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

mat-card {
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
}

mat-card-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 10px;
}

mat-form-field {
  width: 100%;
  margin-bottom: 16px;
}

button {
  width: 100%;
  padding: 10px;
}
 `,
})
export class SignupComponent {
  readonly #auth = inject(AuthService);
  readonly #router = inject(Router);

  matcher = new MyErrorStateMatcher();

  form = inject(FormBuilder).group({
    fullname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit() {
    this.#auth.signup(this.form.value as User).subscribe((response) => {
      if (response.success) {
        this.#router.navigate(['signin']);
      }
    });
  }
}
