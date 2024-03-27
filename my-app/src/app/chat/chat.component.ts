import { Component, Input, OnInit } from '@angular/core';
import { ChannellistComponent } from '../channellist/channellist.component';
import { MessagesComponent } from '../messagesList/messages.component';
import { NavComponent } from '../nav/nav.component';
import { RouterOutlet } from '@angular/router';
import { MessageServiceService } from '../services/message-service.service';
import { MessageInputComponent } from '../message-input/message-input.component';
import { ChannelserviceService } from '../services/channelservice.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [RouterOutlet,ChannellistComponent,MessagesComponent,NavComponent,MessageInputComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  @Input() author!: string;
  @Input() search: boolean = true;
  @Input() url!: string;

  constructor(private messageService: MessageServiceService,private channelService: ChannelserviceService) {}

  ngOnInit(): void {
    console.log("author:", this.author);
    this.messageService.setUrl(this.url);
    this.channelService.setUrl(this.url);
  }
}