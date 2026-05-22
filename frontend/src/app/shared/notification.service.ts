import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private nextId = 1;

  get notifications$(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  private push(notification: Omit<Notification, 'id'>, ttl = 4000) {
    const n: Notification = { id: this.nextId++, ...notification };
    const current = this.notificationsSubject.value.slice();
    current.push(n);
    this.notificationsSubject.next(current);

    if (ttl > 0) {
      setTimeout(() => this.remove(n.id), ttl);
    }
  }

  showSuccess(message: string, ttl = 2000) { this.push({ type: 'success', message }, ttl); }
  showError(message?: string, ttl = 6000) { 
    const errorMsg = (message && message.trim()) ? message.trim() : 'Une erreur est survenue';
    this.push({ type: 'error', message: errorMsg }, ttl); 
  }
  showInfo(message?: string, ttl = 4000) { 
    const infoMsg = (message && message.trim()) ? message.trim() : 'Information';
    this.push({ type: 'info', message: infoMsg }, ttl); 
  }

  remove(id: number) {
    const list = this.notificationsSubject.value.filter(n => n.id !== id);
    this.notificationsSubject.next(list);
  }
}
