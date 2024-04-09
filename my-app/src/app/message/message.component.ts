import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from '../models/message';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from '../messagesList/messages.component';
import { MessageServiceService } from '../services/message-service.service';
import { LinkPreviewComponent } from "../link-preview/link-preview.component";
import { LinkPreviewService } from '../services/link-preview.service';
import { LinkPreview } from '../models/link-preview';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MessageDetailService } from '../services/message-detail.service';

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
  @Input() onMessageClick!: (message: Message) => void;
  linkPreview: LinkPreview | undefined;

  isCurrentUser: boolean = false;

  constructor(
    private messageService: MessageServiceService,
    private linkPreviewService: LinkPreviewService,
    private sanitizer: DomSanitizer,
    public messageDetailService: MessageDetailService
  ) { }

  ngOnInit() {
    this.isCurrentUser = this.message.author === this.currentUser;
    this.linkPreviewService.fetchLinkPreview(this.message.body)?.subscribe(linkPreview => {
      this.linkPreview = linkPreview;
    })
  }

  onClickMessage(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    
    const tagName = targetElement.tagName.toLowerCase();
    if (tagName !== 'a' && tagName !== 'img' && tagName !== 'button' && tagName !== 'svg' && tagName !== 'path') {
      this.onMessageClick(this.message);
    }
  }

  reply(event: MouseEvent) {
    if (!this.messageService.isModifying()) {
      this.messageService.setReplying(true);
      this.messageService.setReplyingOrModifyingTo(this.message.id);
    }
    else{
      this.messageService.setModifying(false);
      this.messageService.setReplying(true);
      this.messageService.setReplyingOrModifyingTo(this.message.id);
    }
  }

  modify(event: MouseEvent) {
    if (!this.messageService.isReplying()) {
      this.messageService.setModifying(true);
      this.messageService.setReplyingOrModifyingTo(this.message.id);
    }
    else{
      this.messageService.setReplying(false);
      this.messageService.setModifying(true);
      this.messageService.setReplyingOrModifyingTo(this.message.id);
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
