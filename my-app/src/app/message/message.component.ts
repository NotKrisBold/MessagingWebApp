import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from '../messagesList/messages.component';
import { MessageServiceService } from '../services/message-service.service';


@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, MessagesComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit {
  @Input()
  message!: Message;
  @Input()
  currentUser!: string;
  @Input()
  parentMessage: Message | undefined;
  isReplying = false;
  isModifying = false;

  isCurrentUser: boolean = false;

  constructor(private messageService: MessageServiceService) {

  }

  ngOnInit() {
    this.isCurrentUser = this.message.author === this.currentUser;
  }


  reply(id: string) {
    this.isReplying = true;
    this.isModifying = false;
    this.messageService.setModifying(false);
    this.messageService.setReplying(true);
    this.messageService.setReplyingTo(id);
  }

  modify(id: string) {
    this.isModifying = true;
    this.isReplying = false;
    this.messageService.setReplying(false);
    this.messageService.setModifying(true);
    this.messageService.setReplyingTo(id);
  }

}
