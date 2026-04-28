import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  private readonly http = inject(HttpClient);
  public readonly API_status = signal<string>('Loading...');

  constructor() {
    this.http.get('/api/v1/welcome/status', { responseType: 'text' }).subscribe({
      next: (response) => this.API_status.set(response),
      error: (error) => this.API_status.set(`Error: ${error.message}`)
    });
  }
}
