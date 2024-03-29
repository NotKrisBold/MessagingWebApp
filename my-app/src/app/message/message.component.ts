import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  deactivateButtons(event: MouseEvent){
    const activeButtons = document.querySelectorAll('.active');
    activeButtons.forEach(button => {
      if (button !== event.target) {
        button.classList.remove('active');
      }
    });
  }

  reply(event: MouseEvent) {
    this.deactivateButtons(event);
    this.isReplying = !this.isReplying;
    if (this.isReplying) {
      this.isModifying = false;
      this.messageService.setModifying(false);
      this.messageService.setReplying(true);
      this.messageService.setReplyingTo(this.message.id);
    }else{
      this.messageService.setReplying(false);
    }
  }

  modify(event: MouseEvent) {
    this.deactivateButtons(event);
    this.isModifying = !this.isModifying;
    if (this.isModifying) {
      this.isReplying = false;
      this.messageService.setReplying(false);
      this.messageService.setModifying(true);
      this.messageService.setReplyingTo(this.message.id);
    } else {
      this.messageService.setModifying(false);
    }
  }

}
