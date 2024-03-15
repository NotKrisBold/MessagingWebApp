import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit{
  messages: any[] = [];

  httpclient = inject(HttpClient);

  ngOnInit(): void {
    this.fetchMessages();
  }

  fetchMessages(){
    this.httpclient.get("https://supsi-ticket.cloudns.org/supsi-chat/bff/channels/1/messages?apiKey=API_KEY").subscribe((data: any) => {
      this.messages = data;
    }, (error) => {
      console.log("No messages found", error);
    });
  }
}
