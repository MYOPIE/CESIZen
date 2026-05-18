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
  private apiUrl = 'http://localhost:8080/api/v1/categories';

  constructor(private http: HttpClient) { }

  getCategories(type?: 'ACTIVITY' | 'INFORMATION'): Observable<Category[]> {
    if (type) {
        return this.http.get<Category[]>(`${this.apiUrl}?type=${type}`);
    }
    return this.http.get<Category[]>(this.apiUrl);
  }

  createCategory(category: Partial<Category>): Observable<Category> {
      return this.http.post<Category>(this.apiUrl, category);
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
      return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
