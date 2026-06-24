import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = '/api/favorites';

  constructor(private http: HttpClient, private authService: AuthService) { }

  addFavoriteActivity(activityId: number): Observable<void> {
    const userId = this.authService.currentUserValue?.id;
    return this.http.post<void>(`${this.apiUrl}/users/${userId}/activities/${activityId}`, {});
  }

  removeFavoriteActivity(activityId: number): Observable<void> {
    const userId = this.authService.currentUserValue?.id;
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}/activities/${activityId}`);
  }

  addFavoriteInformation(informationId: number): Observable<void> {
    const userId = this.authService.currentUserValue?.id;
    return this.http.post<void>(`${this.apiUrl}/users/${userId}/informations/${informationId}`, {});
  }

  removeFavoriteInformation(informationId: number): Observable<void> {
    const userId = this.authService.currentUserValue?.id;
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}/informations/${informationId}`);
  }

  getFavoriteActivities(): Observable<any[]> {
    const userId = this.authService.currentUserValue?.id;
    return this.http.get<any[]>(`${this.apiUrl}/users/${userId}`);
  }

  getFavoriteInformations(): Observable<any[]> {
    const userId = this.authService.currentUserValue?.id;
    return this.http.get<any[]>(`${this.apiUrl}/users/${userId}/informations`);
  }
}
