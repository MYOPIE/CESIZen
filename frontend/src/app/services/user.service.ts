import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponse } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/v1/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.apiUrl);
  }

  getUserById(id: number) {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: number, data: any) {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}`, data);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }

  deactivateUser(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/deactivate`, {}, { responseType: 'text' });
  }

  reactivateUser(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/reactivate`, {}, { responseType: 'text' });
  }

  promoteToAdmin(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/promote-admin`, {}, { responseType: 'text' });
  }

  demoteFromAdmin(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/demote-admin`, {}, { responseType: 'text' });
  }
}
