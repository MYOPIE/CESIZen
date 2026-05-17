import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  type: 'ACTIVITY' | 'INFORMATION';
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = '/api/categories';

  constructor(private http: HttpClient) { }

  getCategories(type: 'ACTIVITY' | 'INFORMATION'): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}?type=${type}`);
  }
}
