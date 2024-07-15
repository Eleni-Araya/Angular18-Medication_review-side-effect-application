import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService, initial_state } from './auth/auth.service';

import { ListComponent } from './medication/list.component';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    ListComponent,
  ],
  template: `
    @if(auth.is_logged_in()){
    <nav>
      <li class="example-button-row">
        <a [routerLink]="['', 'medications', 'add']">Add New Medication</a>
        <button mat-stroked-button (click)="home()">Home</button>
        <button mat-stroked-button (click)="logout()">LogOut</button>
      </li>
    </nav>
    }@else{
    <h1>Welcome to {{ title }}!</h1>
    <div class="example-button-row">
      <button mat-stroked-button (click)="home()">Home</button>
      <button mat-stroked-button (click)="signIn()">Sign In</button>
      <button mat-stroked-button (click)="signUp()">Sign Up</button>
    </div>
    }
    <router-outlet />
  `,
  styles: `.example-button-row {
  display:flex;
  gap:16px;
  justify-content:right;
  align-items:center;
  margin: 20px 0;
}`,
})
export class AppComponent {
  title = 'Medication List';
  readonly auth = inject(AuthService);
  readonly #router = inject(Router);

  signUp() {
    this.#router.navigate(['', 'signup']);
  }

  signIn() {
    this.#router.navigate(['', 'signin']);
  }

  ngOnInit() {
    this.#router.navigate(['medications', 'list']);
  }

  home() {
    this.#router.navigate(['medications', 'list']);
  }

  logout() {
    this.auth.state$.set(initial_state);
    this.#router.navigate(['medications', 'list']);
  }
}
