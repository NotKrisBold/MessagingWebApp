import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { Channel } from '../models/channel';

@Injectable({
  providedIn: 'root'
})
export class ChannelserviceService {
  private currentChannel: Channel | undefined;
  public currentChannel$: Observable<Channel | undefined>;
  private currentChannelSubject: BehaviorSubject<Channel | undefined>;
  private channelUrl = 'https://supsi-ticket.cloudns.org/supsi-chat/bff/channels';

  constructor(private httpClient: HttpClient) {
    this.currentChannelSubject = new BehaviorSubject<Channel | undefined>(undefined);
    this.currentChannel$ = this.currentChannelSubject.asObservable();
  }

  getChannels(): Observable<Channel[]> {
    return this.httpClient.get<Channel[]>(this.channelUrl).pipe(
      tap(channels => {
        if (channels && channels.length > 0) {
          this.setCurrentChannel(channels[0]); // Set the first channel as the current one
        }
      })
    );
  }

  setCurrentChannel(channel: Channel | undefined): void {
    this.currentChannel = channel;
    this.currentChannelSubject.next(channel); // Notify subscribers about the change
  }

  getCurrentChannel(): Observable<Channel | undefined> {
    return this.currentChannel$;
  }
}
