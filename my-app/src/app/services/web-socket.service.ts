import { Injectable, OnInit } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { Message } from '../models/message';
import { Subject } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private API_KEY = environment.apiKey;
  private messageSubject: Subject<Message>;
  private client: Client;
  constructor() { 
    this.client = new Client();
    this.client.brokerURL = 'wss://supsi-ticket.cloudns.org/supsi-chat/supsi-chat-websocket';
    this.messageSubject = new Subject<Message>();

    this.client.onConnect = () => {
      console.log('STOMP connected');

      this.client.subscribe(`/app/${this.API_KEY}/new-message`, (message) => {
        const newMessage: Message = JSON.parse(message.body);
        this.messageSubject.next(newMessage);
      });

      this.client.subscribe(`/app/${this.API_KEY}/update-message`, (message) => {
        const newMessage: Message = JSON.parse(message.body);
        this.messageSubject.next(newMessage);
      });
    };

    this.client.activate();
  }

 getMessageSubject(): Subject<Message> {
    return this.messageSubject;
  }
}
