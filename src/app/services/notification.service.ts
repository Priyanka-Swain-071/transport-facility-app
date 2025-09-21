import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  private notificationId = 0;

  showSuccess(message: string): void {
    this.addNotification(message, 'success');
  }

  showError(message: string): void {
    this.addNotification(message, 'error');
  }

  showInfo(message: string): void {
    this.addNotification(message, 'info');
  }

  private addNotification(message: string, type: 'success' | 'error' | 'info'): void {
    const notification: Notification = {
      message,
      type,
      id: ++this.notificationId
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, 5000);
  }

  removeNotification(id: number): void {
    const currentNotifications = this.notificationsSubject.value;
    const filteredNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(filteredNotifications);
  }
}