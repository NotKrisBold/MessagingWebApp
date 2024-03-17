import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Channel } from '../channel';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ChannelserviceService } from '../channelservice.service';
import { CommonModule, NgIf } from '@angular/common';
import { Message } from '../message';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [HttpClientModule,NgIf,CommonModule,RouterModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit{
  messages: Message[] | undefined;
  channel: Channel | undefined;
  constructor(
    private route: ActivatedRoute,
    private service: ChannelserviceService,
  ) {}


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = parseInt(params['id'], 10);
      if (!isNaN(id)) {
        this.getChannelMessage(id);
      }
    });
  }

  getChannelMessage(id: number): void {
    this.service.getChannelMessage(id)
      .subscribe(messages => this.messages = messages);
  }
}

