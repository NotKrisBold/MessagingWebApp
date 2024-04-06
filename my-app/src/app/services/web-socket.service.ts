import { Injectable, OnInit } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { Message } from '../models/message';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private API_KEY = "boldini-elaidy"; // Replace this with your API key
  private messageSubject: Subject<Message>;
  private client: Client;
  constructor() { 
    this.client = new Client();
    this.client.brokerURL = 'wss://supsi-ticket.cloudns.org/supsi-chat/supsi-chat-websocket';
    this.messageSubject = new Subject<Message>();

    this.client.onConnect = () => {
      console.log('STOMP connected');

      // Subscribe to new messages
      this.client.subscribe(`/app/${this.API_KEY}/new-message`, (message) => {
        const newMessage: Message = JSON.parse(message.body);
        this.messageSubject.next(newMessage);
      });

      // Subscribe to updated messages
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
