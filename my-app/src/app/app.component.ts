import { Component, Injectable, Injector } from '@angular/core';
import { ChatComponent } from './chat/chat.component';
import { Message } from './models/message';
import { CommonModule } from '@angular/common';
import { MessageDetailService } from './services/message-detail.service';
import { MessageDetailsModalComponent } from './message-details-modal/message-details-modal.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatComponent, CommonModule, MessageDetailsModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(public messageDetailService: MessageDetailService){}

  handleMessageClick(message: Message) {
    alert(message.author);
  }

  showMessageDetails(message: Message) {
    this.messageDetailService.message = message;
    this.messageDetailService.showMessageDetails = true;
  }
}

