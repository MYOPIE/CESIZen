import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentRefreshService {
  private readonly activitiesChangedSubject = new Subject<void>();
  private readonly informationsChangedSubject = new Subject<void>();
  private readonly usersChangedSubject = new Subject<void>();

  readonly activitiesChanged$ = this.activitiesChangedSubject.asObservable();
  readonly informationsChanged$ = this.informationsChangedSubject.asObservable();
  readonly usersChanged$ = this.usersChangedSubject.asObservable();

  notifyActivitiesChanged(): void {
    this.activitiesChangedSubject.next();
  }

  notifyInformationsChanged(): void {
    this.informationsChangedSubject.next();
  }

  notifyUsersChanged(): void {
    this.usersChangedSubject.next();
  }
}
