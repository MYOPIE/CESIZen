import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './category.service';
import { DifficultyLevel } from './difficulty.service';

export interface Activite {
  id: number;
  title: string;
  description: string;
  content: string;
  instructions: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  category?: Category; 
  difficultyLevel?: DifficultyLevel;
  durationMinutes?: number;
  duree?: number;
  image?: string;
  isFavorite?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ActiviteService {
  private apiUrl = 'http://localhost:8080/api/v1/activities';

  constructor(private http: HttpClient) {}

  getAllActivites(): Observable<Activite[]> {
    return this.http.get<Activite[]>(this.apiUrl);
  }

  getActiveActivites(): Observable<Activite[]> {
    return this.http.get<Activite[]>(`${this.apiUrl}/active`);
  }

  getActiviteById(id: number): Observable<Activite> {
    return this.http.get<Activite>(`${this.apiUrl}/${id}`);
  }

  createActivite(activite: Partial<Activite>): Observable<Activite> {
    return this.http.post<Activite>(this.apiUrl, activite);
  }

  updateActivite(id: number, activite: Partial<Activite>): Observable<Activite> {
    return this.http.put<Activite>(`${this.apiUrl}/${id}`, activite);
  }

  deleteActivite(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }

  deactivateActivite(id: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}/deactivate`, {}, { responseType: 'text' });
  }

  reactivateActivite(id: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}/reactivate`, {}, { responseType: 'text' });
  }
}
