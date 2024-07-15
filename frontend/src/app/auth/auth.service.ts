import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from './user.type';

export interface State {
  _id: string;
  fullname: string;
  email: string;
  jwt: string;
}

export const initial_state = {
  _id: '',
  fullname: '',
  email: '',
  jwt: '',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  state$ = signal<State>(initial_state);
  readonly #http = inject(HttpClient);

  signup(user: User) {
    return this.#http.post<{ success: boolean; data: User }>(
      environment.BACKEND_SERVER_URL + '/users/signup',
      user
    );
  }

  signin(credentials: { email: string; password: string }) {
    return this.#http.post<{ success: boolean; data: string }>(
      environment.BACKEND_SERVER_URL + '/users/signin',
      credentials
    );
  }

  is_logged_in() {
    return this.state$()._id ? true : false;
  }

  constructor() {
    effect(() => {
      localStorage.setItem('finalProject', JSON.stringify(this.state$()));
    });
  }
}
