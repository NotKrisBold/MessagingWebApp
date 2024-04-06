import { Component, Input, OnInit } from '@angular/core';
import { ChannellistComponent } from '../channellist/channellist.component';
import { MessagesComponent } from '../messagesList/messages.component';
import { NavComponent } from '../nav/nav.component';
import { RouterOutlet } from '@angular/router';
import { MessageServiceService } from '../services/message-service.service';
import { MessageInputComponent } from '../message-input/message-input.component';
import { ChannelserviceService } from '../services/channelservice.service';
import { Message } from '../models/message';
import { MessageDetailsModalComponent } from '../message-details-modal/message-details-modal.component';
import { CommonModule } from '@angular/common';
import { MessageDetailService } from '../services/message-detail.service';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [RouterOutlet,ChannellistComponent,MessagesComponent,NavComponent,MessageInputComponent,MessageDetailsModalComponent,CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  providers: [MessageServiceService, ChannelserviceService, MessageDetailService]
})
export class ChatComponent implements OnInit {
  @Input() author!: string;
  @Input() search: boolean = true;
  @Input() url!: string;
  @Input() onMessageClick!: (message : Message) => void;

  constructor(private messageService: MessageServiceService,private channelService: ChannelserviceService,public messageDetailService: MessageDetailService) {}
  
  ngOnInit(): void {
    this.messageService.setUrl(this.url);
    this.messageService.setAuthor(this.author);
    this.channelService.setUrl(this.url);
  }
}