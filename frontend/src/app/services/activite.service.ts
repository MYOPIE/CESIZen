import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './category.service';

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
  duree?: number;
  difficulte?: number;
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

  deleteActivite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deactivateActivite(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  reactivateActivite(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/reactivate`, {});
  }
}
