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
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
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
  filteredMessages: Message[] = [];
  searchTerms: Subject<string> = new Subject<string>();
  isSearching = false;

  constructor(
    private messageService: MessageServiceService,
    private channelService: ChannelserviceService,
    private webSocketService: WebSocketService
  ) {
  }



  ngOnInit(): void {
    this.subscribeToWebSocket();
    this.getCurrentChannelMessages();
  }

  private subscribeToWebSocket(): void {
    this.webSocketService.getMessageSubject().subscribe((message: Message) => {
      const existingMessageIndex = this.messages.findIndex(m => m.id === message.id);
      if (existingMessageIndex !== -1) {
        this.messages[existingMessageIndex] = message;
      } else {
        this.messages.push(message);
        this.showNewMessageIndicator = true;
      }
    });
  }

  private getCurrentChannelMessages(): void {
    this.channelService.getCurrentChannel().subscribe(channel => {
      if (channel?.id) {
        this.channelId = channel.id;
        this.getChannelMessages();
      }
    }, (error) => {
      console.error('Error loading messages:', error);
    });
  }

  search(event: Event): void {
    if((event.target as HTMLInputElement).value){
    this.isSearching = true;
    const term = (event.target as HTMLInputElement).value;
    this.filteredMessages = this.messages.filter(message =>
      message.author.toLowerCase().includes(term.toLowerCase()) ||
      message.body.toLowerCase().includes(term.toLowerCase())
    );
    }else this.isSearching = false;
  }

  ngAfterViewInit(): void {
    this.messageList.nativeElement.addEventListener('scroll', () => {
      this.updateScrollButtonVisibilityAndNewMessageIndicator();
    });
  }

  private updateScrollButtonVisibilityAndNewMessageIndicator(): void {
    const messageListElement: HTMLElement = this.messageList.nativeElement;
    const isAtBottom = messageListElement.scrollHeight - messageListElement.scrollTop <= messageListElement.clientHeight;
    this.showScrollButton = !isAtBottom;
    if (this.showNewMessageIndicator)
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

  private getChannelMessages(): void {
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


