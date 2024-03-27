import { Component, Input } from '@angular/core';
import { Message } from '../models/message';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from '../messagesList/messages.component';
import { MessageServiceService } from '../services/message-service.service';
import { LinkPreviewComponent } from "../link-preview/link-preview.component";
import { LinkPreviewService } from '../services/link-preview.service';
import { LinkPreview } from '../models/link-preview';


@Component({
    selector: 'app-message',
    standalone: true,
    templateUrl: './message.component.html',
    styleUrl: './message.component.css',
    imports: [CommonModule, MessagesComponent, LinkPreviewComponent]
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
  linkPreview: LinkPreview | undefined;
  

  isCurrentUser: boolean = false;

  constructor(
    private messageService: MessageServiceService,
    private linkPreviewService: LinkPreviewService
    ) {}

  ngOnInit() {
    this.isCurrentUser = this.message.author === this.currentUser;
    this.linkPreviewService.fetchLinkPreviews(this.message.body)?.subscribe(linkPreview => {
      this.linkPreview = linkPreview;
      console.log("LINKPREVIEW", this.linkPreview);
    })
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


