import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(private apiService: ApiService) {}

  fetchNotifications() {
    return this.apiService.get('/notifications').pipe(
      tap((data: any) => {
        this.notificationsSubject.next(data);
      })
    );
  }

  markAsRead(id: number) {
    return this.apiService.put(`/notifications/${id}/read`, {}).pipe(
      tap(() => {
        const current = this.notificationsSubject.value;
        const updated = current.map(n => n.id === id ? { ...n, estLue: true } : n);
        this.notificationsSubject.next(updated);
      })
    );
  }

  markAllAsRead() {
    return this.apiService.put(`/notifications/read-all`, {}).pipe(
      tap(() => {
        const current = this.notificationsSubject.value;
        const updated = current.map(n => ({ ...n, estLue: true }));
        this.notificationsSubject.next(updated);
      })
    );
  }

  get unreadCount$() {
    return this.notificationsSubject.asObservable(); // We will map in the component
  }
}
