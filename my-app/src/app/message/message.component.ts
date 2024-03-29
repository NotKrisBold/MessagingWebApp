import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from '../models/message';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from '../messagesList/messages.component';
import { MessageServiceService } from '../services/message-service.service';
import { LinkPreviewComponent } from "../link-preview/link-preview.component";
import { LinkPreviewService } from '../services/link-preview.service';
import { LinkPreview } from '../models/link-preview';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
    selector: 'app-message',
    standalone: true,
    templateUrl: './message.component.html',
    styleUrl: './message.component.css',
    imports: [CommonModule, MessagesComponent, LinkPreviewComponent]
})
export class MessageComponent implements OnInit {
  @Input()
  message!: Message;
  @Input()
  currentUser!: string;
  @Input()
  parentMessage: Message | undefined;
  isReplying = false;
  linkPreview: LinkPreview | undefined;
  isModifying = false;

  isCurrentUser: boolean = false;

  constructor(
    private messageService: MessageServiceService,
    private linkPreviewService: LinkPreviewService,
    private sanitizer: DomSanitizer
    ) {}

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

  sanitizeMessageBody(body: string): SafeHtml {
     // Regular expression to match URLs
     const urlRegex = /(https?:\/\/[^\s]+)/g;

     // Replace URLs with anchor tags
     const sanitizedBody = body.replace(urlRegex, (url) => {
       return `<a href="${url}" target="_blank">${url}</a>`;
     });
 
     // Sanitize the modified body to make it safe HTML
     return this.sanitizer.bypassSecurityTrustHtml(sanitizedBody);
   }
}