import { Component, Input } from '@angular/core';
import { Message } from '../models/message';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from '../messagesList/messages.component';
import { MessageServiceService } from '../services/message-service.service';


@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule,MessagesComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  @Input()
  message!: Message;
  @Input()
  messages!: Message[];
  @Input()
  currentUser!: string;
  @Input()
  getMessageById!: Function;
  

  isCurrentUser: boolean = false;

  constructor(private messageService: MessageServiceService) {}

  ngOnInit() {
    this.isCurrentUser = this.message.author === this.currentUser;
  }

  reply(id: string){
    this.messageService.setReplying(true);
    this.messageService.setReplyingTo(id);
  }

  modify(id:string){
    this.messageService.setModifying(true);
    this.messageService.setReplyingTo(id);
  }
}
