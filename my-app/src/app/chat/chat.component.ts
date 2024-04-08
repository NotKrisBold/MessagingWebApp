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
import { ToastService } from '../services/toast.service';
import { UnreadmessageService } from '../services/unreadmessage.service';
import { ToastComponent } from '../toast/toast.component';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [RouterOutlet,ChannellistComponent,MessagesComponent,NavComponent,MessageInputComponent,MessageDetailsModalComponent,CommonModule,ToastComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  providers: [MessageServiceService, ChannelserviceService, MessageDetailService,ToastService,UnreadmessageService]
})
export class ChatComponent implements OnInit {
  @Input() author!: string;
  @Input() search: boolean = true;
  @Input() channels: boolean = true;
  @Input() url!: string;
  @Input() onMessageClick!: (message : Message) => void;
  public searchResult: Message[] | undefined;
  private currentChannelId: number | undefined;

  constructor(private messageService: MessageServiceService,private channelService: ChannelserviceService,public messageDetailService: MessageDetailService) {}
  
  ngOnInit(): void {
    this.messageService.setUrl(this.url);
    this.messageService.setAuthor(this.author);
    this.channelService.setUrl(this.url);
    this.channelService.getCurrentChannel().subscribe(channel => this.currentChannelId = channel?.id);
  }

  searchMessages(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    if (searchTerm && this.currentChannelId) {
      this.messageService.search(this.currentChannelId, searchTerm).subscribe(messages => this.searchResult = messages);
    }
    else{
      this.searchResult = undefined;
    }
  }
}