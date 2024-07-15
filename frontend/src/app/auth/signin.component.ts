import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';

import { AuthService, State } from './auth.service';
import { User } from './user.type';

import { FormsModule } from '@angular/forms';
import { MyErrorStateMatcher } from './signupError';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-signin',
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
    <form class="example-form" [formGroup]="form" (submit)="login()">
      <mat-card>
        <mat-card-title>SignIn Form</mat-card-title>
        <mat-card-content>
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
  styles: `.example-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}mat-card {
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
}mat-card-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 10px;
}mat-form-field {
  width: 100%;
  margin-bottom: 16px;
}button {
  width: 100%;
  padding: 10px;
}`,
})
export class SigninComponent {
  readonly #auth = inject(AuthService);
  readonly #router = inject(Router);
  readonly #notification = inject(ToastrService);

  matcher = new MyErrorStateMatcher();

  form = inject(FormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  login() {
    this.#auth.signin(this.form.value as User).subscribe({
      next: (response) => {
        if (response.success) {
          const decoded_token = jwtDecode(response.data) as State;
          this.#auth.state$.set({
            _id: decoded_token._id,
            fullname: decoded_token.fullname,
            email: decoded_token.email,
            jwt: response.data,
          });
          this.#router.navigate(['', 'medications', 'list']);
        }
      },
      error: (error) => {
        this.#notification.error(`Invalid Username or Password.`);
      },
    });
  }
}
