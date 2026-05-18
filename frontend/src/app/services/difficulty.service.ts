import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DifficultyLevel {
  id: number;
  name: string;
  isPublished: boolean;
}

export interface DifficultyLevelRequest {
  name: string;
  isPublished?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DifficultyService {
  private apiUrl = 'http://localhost:8080/api/v1/difficulty-levels';

  constructor(private http: HttpClient) {}

  getAllDifficultyLevels(): Observable<DifficultyLevel[]> {
    return this.http.get<DifficultyLevel[]>(this.apiUrl);
  }

  getPublishedDifficultyLevels(): Observable<DifficultyLevel[]> {
    return this.http.get<DifficultyLevel[]>(`${this.apiUrl}/published`);
  }

  getDifficultyLevelById(id: number): Observable<DifficultyLevel> {
    return this.http.get<DifficultyLevel>(`${this.apiUrl}/${id}`);
  }

  createDifficultyLevel(difficultyLevel: DifficultyLevelRequest): Observable<DifficultyLevel> {
    return this.http.post<DifficultyLevel>(this.apiUrl, difficultyLevel);
  }

  updateDifficultyLevel(id: number, difficultyLevel: DifficultyLevelRequest): Observable<DifficultyLevel> {
    return this.http.put<DifficultyLevel>(`${this.apiUrl}/${id}`, difficultyLevel);
  }

  deleteDifficultyLevel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}