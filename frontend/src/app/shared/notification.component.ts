import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from './notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications" aria-live="polite">
      <div *ngFor="let n of (svc.notifications$ | async)" class="toast" [ngClass]="n.type">
        <span class="message">{{ n.message }}</span>
        <button class="close" (click)="dismiss(n.id)">×</button>
      </div>
    </div>
  `,
  styles: [
    `.notifications { position: fixed; top: 1rem; right: 1rem; z-index: 10000; display:flex; flex-direction:column; gap:.5rem; }
     .toast { padding: .6rem .9rem; border-radius:6px; color:#fff; box-shadow:0 2px 6px rgba(0,0,0,.12); display:flex; align-items:center; gap:.6rem; }
     .toast.success { background:#28a745; }
     .toast.error { background:#dc3545; }
     .toast.info { background:#007bff; }
     .toast .close { background:transparent; border:none; color:rgba(255,255,255,.9); font-size:1.1rem; cursor:pointer; }
     .toast .message { font-size:.95rem; }
    `
  ]
})
export class NotificationComponent {
  constructor(public svc: NotificationService) {}

  dismiss(id: number) { this.svc.remove(id); }
}
