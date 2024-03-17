import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { Channel } from './channel';

@Injectable({
  providedIn: 'root'
})
export class ChannelserviceService {

  private channelUrl = 'https://supsi-ticket.cloudns.org/supsi-chat/bff/channels';
  private HttpClient = inject(HttpClient);
  private messageUrl = "https://supsi-ticket.cloudns.org/supsi-chat/bff/channels/";
  private apiKey = "/messages?apiKey=provaa";
  getChannels(): Observable<Channel[]> {
    return this.HttpClient.get<Channel[]>(this.channelUrl);
  }

  getChannelMessage(id: number): Observable<any> {
    const url = `${this.messageUrl}${id}${this.apiKey}`;
    return this.HttpClient.get<any>(url);
  }



  constructor() { }
}
