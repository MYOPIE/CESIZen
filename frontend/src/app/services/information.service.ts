import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './category.service';

export interface Information {
  id: number;
  title: string;
  content: string;
  category?: Category;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
  excerpt?: string;
  icon?: string;
  readingTime?: number;
  isFavorite?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class InformationService {
  private apiUrl = 'http://localhost:8080/api/v1/informations';

  constructor(private http: HttpClient) {}

  getAllInformations(): Observable<Information[]> {
    return this.http.get<Information[]>(this.apiUrl);
  }

  getPublishedInformations(): Observable<Information[]> {
    return this.http.get<Information[]>(`${this.apiUrl}/published`);
  }

  getInformationsByCategory(categoryId: number): Observable<Information[]> {
    return this.http.get<Information[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  getInformationById(id: number): Observable<Information> {
    return this.http.get<Information>(`${this.apiUrl}/${id}`);
  }

  createInformation(info: Partial<Information>): Observable<Information> {
    return this.http.post<Information>(this.apiUrl, info);
  }

  updateInformation(id: number, info: Partial<Information>): Observable<Information> {
    return this.http.put<Information>(`${this.apiUrl}/${id}`, info);
  }

  deleteInformation(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }

  publishInformation(id: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}/publish`, {}, { responseType: 'text' });
  }

  unpublishInformation(id: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}/unpublish`, {}, { responseType: 'text' });
  }
}
