import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = '/api/favorites';

  constructor(private http: HttpClient) { }

  addFavoriteActivity(activityId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/activities/${activityId}`, {});
  }

  removeFavoriteActivity(activityId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/activities/${activityId}`);
  }

  addFavoriteInformation(informationId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/informations/${informationId}`, {});
  }

  removeFavoriteInformation(informationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/informations/${informationId}`);
  }
}
