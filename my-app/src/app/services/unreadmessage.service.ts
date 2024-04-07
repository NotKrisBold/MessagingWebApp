import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnreadmessageService {
  private unreadMessageCounts: { [channelId: number]: number } = {};
  private unreadCountSubject = new Subject<{ channelId: number, count: number }>();

  constructor() {}

  incrementUnreadCount(channelId: number): void {
    if (!this.unreadMessageCounts[channelId]) {
      this.unreadMessageCounts[channelId] = 0;
    }
    this.unreadMessageCounts[channelId]++;
    this.unreadCountSubject.next({ channelId, count: this.unreadMessageCounts[channelId] });
  }

  resetUnreadCount(channelId: number): void {
    this.unreadMessageCounts[channelId] = 0;
    this.unreadCountSubject.next({ channelId, count: 0 });
  }

  getUnreadCountObservable(): Subject<{ channelId: number, count: number }> {
    return this.unreadCountSubject;
  }
}
