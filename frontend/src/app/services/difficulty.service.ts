import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// TODO : créer ce service pour gérer les niveaux de difficulté (ex : récupérer tous les niveaux, etc.)
export interface DifficultyLevel {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class DifficultyService {
  private apiUrl = 'http://localhost:8080/api/v1/difficulty-levels';
    constructor(private http: HttpClient) {}
}