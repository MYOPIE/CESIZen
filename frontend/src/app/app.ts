import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService, UserResponse } from './services/auth.service';
import { NotificationComponent } from './shared/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  public readonly API_status = signal<string>('Loading...');
  public currentUser: UserResponse | null = null;
  public isMenuOpen = false;
  public cookieNoticeHidden = false;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  constructor() {
    this.http.get('/api/v1/welcome/status', { responseType: 'text' }).subscribe({
      next: (response) => this.API_status.set(response),
      error: (error) => this.API_status.set(`Error: ${error.message}`)
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  get userDisplayName(): string {
    if (!this.currentUser) return '';
    return `${this.currentUser.firstName} ${this.currentUser.lastName.toUpperCase()}`;
  }

  dismissCookieNotice(): void {
    try {
      localStorage.setItem('cesizen-rgpd-notice', 'accepted');
    } catch {
      // Aucun stockage disponible, on cache simplement la bannière.
    }
    this.cookieNoticeHidden = true;
  }
}
