import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cookie-notice',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cookie-notice.component.html',
  styleUrl: './cookie-notice.component.scss'
})
export class CookieNoticeComponent implements OnInit {
  isVisible = true;
  private readonly storageKey = 'cesizen-rgpd-notice';

  ngOnInit(): void {
    try {
      this.isVisible = localStorage.getItem(this.storageKey) !== 'accepted';
    } catch {
      this.isVisible = true;
    }
  }

  dismiss(): void {
    try {
      localStorage.setItem(this.storageKey, 'accepted');
    } catch {
      // Aucun stockage disponible, on ferme simplement la bannière.
    }
    this.isVisible = false;
  }
}