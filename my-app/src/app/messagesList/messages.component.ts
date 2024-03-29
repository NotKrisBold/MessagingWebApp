import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Channel } from '../models/channel';
import { RouterModule } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { Message } from '../models/message';
import { v4 as uuidv4 } from 'uuid';
import { MessageServiceService } from '../services/message-service.service';
import { MessageInputComponent } from "../message-input/message-input.component";
import { ChannelserviceService } from '../services/channelservice.service';
import { MessageComponent } from '../message/message.component';
import { WebSocketService } from '../services/web-socket.service';
@Component({
  selector: 'app-messages',
  standalone: true,
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
  imports: [HttpClientModule, NgIf, CommonModule, RouterModule, MessageInputComponent, MessageComponent]
})

export class MessagesComponent implements OnInit, AfterViewInit {
  messages: Message[] = [];
  channel: Channel | undefined;
  @Input() authorMessage: string = "";
  messageBody: string = "";
  selectedFile: File | null = null;
  fileAttached: boolean = false;
  channelId: number = 0;
  apiKey = "boldini-elaidy";
  @ViewChild('messageList') messageList!: ElementRef;
  showScrollButton: boolean = false;
  showNewMessageIndicator = false;
  showConfirmationMessage = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private messageService: MessageServiceService,
    private channelService: ChannelserviceService,
    private webSocketService: WebSocketService
  ) {
  }



  ngOnInit(): void {
    this.webSocketService.getMessageSubject().subscribe((message: Message) => {
      const existingMessageIndex = this.messages.findIndex(m => m.id === message.id);
      if (existingMessageIndex !== -1) {
        // If the message exists, update it with the new data
        this.messages[existingMessageIndex] = message;
      } else {
        // If the message doesn't exist, add it to the array
        this.messages.push(message);
        this.showNewMessageIndicator = true;
      }

      
    });

    this.webSocketService.getMessageSubject().subscribe((message: Message) => {
    });

    console.log("authore messages", this.authorMessage);
    this.selectedFile ? this.selectedFile : new Blob();

    this.channelService.getCurrentChannel().subscribe(channel => {
      if (channel?.id) {
        this.channelId = channel.id;
        this.getChannelMessages();
      }
    }, (error) => {
      console.error('Error loading messages:', error);
    });
  }

  ngAfterViewInit(): void {
    this.messageList.nativeElement.addEventListener('scroll', () => {
      this.updateScrollButtonVisibility();
    });
  }

  updateScrollButtonVisibility(): void {
    const messageListElement: HTMLElement = this.messageList.nativeElement;
    const isAtBottom = messageListElement.scrollHeight - messageListElement.scrollTop <= messageListElement.clientHeight;
    this.showScrollButton = !isAtBottom;
    if(this.showNewMessageIndicator)
      this.showNewMessageIndicator = !isAtBottom;
}


  scrollToBottomSmoothly(): void {
    try {
      this.messageList.nativeElement.scrollTo({
        top: this.messageList.nativeElement.scrollHeight,
        behavior: 'smooth'
      });
    } catch (err) { }
  }

  onMessageListScroll(): void {
    const messageListElement: HTMLElement = this.messageList.nativeElement;
    // Check if the user is not at the bottom of the message list
    this.showScrollButton = messageListElement.scrollHeight - messageListElement.scrollTop > messageListElement.clientHeight;
  }

  getChannelMessages(): void {
    this.messageService.getChannelMessages(this.channelId)
      .subscribe(messages => {
        this.messages = messages
      });
  }

  onSubmit(data: { text: string, file: File | null }) {
    const message = data.text;
    this.selectedFile = data.file;
    if (this.messageService.isModifying()) {
      this.sendUpdateMessage(message);
      this.messageService.setModifying(false);
    }
    else if (this.messageService.isReplying()) {
      this.sendReplyMessage(message);
      this.messageService.setReplying(false);
    }
    else
      this.sendMessage(message);
  }

  sendUpdateMessage(message: string) {
    this.messageService.updateMessage(this.messageService.getReplyingTo(), message).subscribe();
  }

  sendReplyMessage(message: string) {
    if (message != "") {
      const newMessage = new Message(
        uuidv4(),
        this.messageService.getReplyingTo(),
        message,
        this.authorMessage,
        new Date().toISOString(),
        new Date().toISOString(),
        1,
        this.selectedFile
      );
      const formdata = new FormData();
      formdata.append("message", new Blob([JSON.stringify(newMessage)], { type: 'application/json' }));
      formdata.append("attachment", this.selectedFile ? this.selectedFile : new Blob());
      console.log(this.selectedFile);
      formdata.forEach((data) => console.log(data));
      this.messageService.addMessage(formdata, this.channelId).subscribe();
      this.removeFile();
    }

  }

  sendMessage(message: string) {
    if (message != "") {
      const newMessage = new Message(
        uuidv4(),
        null,
        message,
        this.authorMessage,
        new Date().toISOString(),
        new Date().toISOString(),
        1,
        this.selectedFile
      );
      console.log("message id:", newMessage.id);
      const formdata = new FormData();
      formdata.append("message", new Blob([JSON.stringify(newMessage)], { type: 'application/json' }));
      formdata.append("attachment", this.selectedFile ? this.selectedFile : new Blob());
      console.log(this.selectedFile);
      formdata.forEach((data) => console.log(data));
      this.messageService.addMessage(formdata, this.channelId).subscribe();
      this.removeFile();
    }
  }

  removeFile() {
    this.fileAttached = false;
    this.selectedFile = null;
  }

  getMessageById(id: string | null): Message | undefined {
    if (!id) return undefined;

    for (let i = 0; i < this.messages.length; i++) {
      if (this.messages[i].id === id) {
        return this.messages[i];
      }
    }

    return undefined;
  }

}

