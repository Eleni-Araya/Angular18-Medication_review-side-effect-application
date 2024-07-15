import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Image, Medication, Owner, Review } from './medication.type';
import { AuthService } from '../auth/auth.service';

const image: Image = { _id: '', filename: '', originalname: '' };

const owner: Owner = {
  user_id: '',
  fullname: '',
  email: '',
};
const review: Review[] = [];

export const intial_med_state: Medication = {
  _id: '',
  name: '',
  first_letter: '',
  generic_name: '',
  medication_class: '',
  availability: 'Prescription',
  image: image,
  added_by: owner,
  reviews: review,
};
@Injectable({
  providedIn: 'root',
})
export class MedicationService {
  readonly authService = inject(AuthService);
  readonly #http = inject(HttpClient);
  $medState = signal<Medication>(intial_med_state);

  addMedication(medicine: FormData) {
    return this.#http.post<{ success: boolean; data: Medication }>(
      environment.BACKEND_SERVER_URL + '/medications/',
      medicine
    );
  }

  getMedications$ = this.#http.get<{ success: boolean; data: Medication[] }>(
    environment.BACKEND_SERVER_URL + '/medications'
  );

  getMedicationById(medication_id: string) {
    return this.#http.get<{ success: boolean; data: Medication }>(
      environment.BACKEND_SERVER_URL + '/medications/' + medication_id
    );
  }

  getMedicationByFirstLetter(first_letter: string) {
    return this.#http.get<{ success: boolean; data: Medication[] }>(
      environment.BACKEND_SERVER_URL +
        `/medications?first_letter=${first_letter}`
    );
  }

  updateMedication(medication: FormData, med_id: string) {
    return this.#http.put<{ success: boolean; data: boolean }>(
      environment.BACKEND_SERVER_URL + '/medications/' + med_id,
      medication
    );
  }

  deleteMedicationById(med_id: string) {
    return this.#http.delete<{ success: boolean; data: boolean }>(
      environment.BACKEND_SERVER_URL + '/medications/' + med_id
    );
  }

  addReview(id: string, review: Review) {
    return this.#http.post<{ success: boolean; data: string }>(
      environment.BACKEND_SERVER_URL + '/medications/' + id + '/reviews',
      review
    );
  }

  getReviews(Med_id: string) {
    return this.#http.get<{ success: boolean; data: Review[] }>(
      environment.BACKEND_SERVER_URL + '/medications/' + Med_id + '/reviews'
    );
  }

  getReviewByID(medication_id: string, review_id: string) {
    return this.#http.get<{ success: boolean; data: Review }>(
      environment.BACKEND_SERVER_URL +
        '/medications/' +
        medication_id +
        '/reviews/' +
        review_id
    );
  }

  updateReview(newReview: Review, medication_id: string, review_id: string) {
    return this.#http.put<{ success: boolean; data: boolean }>(
      environment.BACKEND_SERVER_URL +
        '/medications/' +
        medication_id +
        '/reviews/' +
        review_id,
      newReview
    );
  }

  deleteReview(medication_id: string, review_id: string) {
    return this.#http.delete<{ success: boolean; data: boolean }>(
      environment.BACKEND_SERVER_URL +
        '/medications/' +
        medication_id +
        '/reviews/' +
        review_id
    );
  }

  getMedicationByName(medication_name: string) {
    return this.#http.get<{ success: boolean; data: boolean }>(
      environment.BACKEND_SERVER_URL + '/medications/name/' + medication_name
    );
  }
}
