import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { Channel } from '../models/channel';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class ChannelserviceService {
  private channelUrl = 'https://supsi-ticket.cloudns.org/supsi-chat/bff/channels';
  private HttpClient = inject(HttpClient);


  getChannels(): Observable<Channel[]> {
    return this.HttpClient.get<Channel[]>(this.channelUrl);
  }
  

}
