import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
import { ToastComponent } from '../toast/toast.component';
import { ToastService } from '../services/toast.service';
import { UnreadmessageService } from '../services/unreadmessage.service';
import { Subject, throwError } from 'rxjs'; 
import { catchError, max } from 'rxjs/operators'; 


@Component({
  selector: 'app-messages',
  standalone: true,
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
  imports: [HttpClientModule, NgIf, CommonModule, RouterModule, MessageInputComponent, MessageComponent,ToastComponent],
})

export class MessagesComponent implements OnInit, AfterViewInit {
  maxScrollWait = 500;
  messages: Message[] = [];
  channel: Channel | undefined;
  @Input() authorMessage: string = "";
  messageBody: string = "";
  selectedFile: File | null = null;
  fileAttached: boolean = false;
  channelId: number = 0;
  @ViewChild('messageList') messageList!: ElementRef;
  showScrollButton: boolean = false;
  showNewMessageIndicator = false;
  showConfirmationMessage = false;
  messagesToDisplay: Message[] = [];
  searchTerms: Subject<string> = new Subject<string>();
  @Input() onMessageClick!: (message: Message) => void;

  constructor(
    public messageService: MessageServiceService,
    private channelService: ChannelserviceService,
    private webSocketService: WebSocketService,
    private toastService: ToastService,
    private unreadService: UnreadmessageService,
    private http: HttpClient 
  ) {}

  showToast(msg: Message): void {
    this.toastService.showToast(msg);
  }

  ngOnInit(): void {
    this.subscribeToWebSocket();
    this.getCurrentChannelMessages();
  }

  ngAfterViewInit(): void {
    this.messageList.nativeElement.addEventListener('scroll', () => {
      this.updateScrollButtonVisibilityAndNewMessageIndicator();
    });
  }

  private subscribeToWebSocket(): void {
    this.webSocketService.getMessageSubject().subscribe((message: Message) => {
      const existingMessageIndex = this.messages.findIndex(m => m.id === message.id);
      if (existingMessageIndex !== -1) {
        this.messages[existingMessageIndex] = message;
      } else {
        if (message.channel !== this.channelId) {
          this.unreadService.incrementUnreadCount(message.channel);
        } else {
          this.messages.push(message);
          if (message.author !== this.authorMessage) {
            this.showNewMessageIndicator = true;
          }
        }
        this.showToast(message);
      }
    }, (error) => {
      console.error('WebSocket Error:', error);
    });
  }

  private getCurrentChannelMessages(): void {
    this.channelService.getCurrentChannel().subscribe(
      (channel: Channel | undefined) => {
        if (channel?.id) {
          this.channelId = channel.id;
          this.getChannelMessages();
          this.unreadService.resetUnreadCount(channel.id);
        }
      },
      (error) => {
        console.error('Error loading current channel:', error);
      }
    );
  }

  search(event: Event): void {
    if ((event.target as HTMLInputElement).value) {
      const term = (event.target as HTMLInputElement).value;
      this.messagesToDisplay = this.messages.filter(message =>
        message.author.toLowerCase().includes(term.toLowerCase()) ||
        message.body.toLowerCase().includes(term.toLowerCase())
      );
    } else {
      this.messagesToDisplay = this.messages;
    }
  }

  private updateScrollButtonVisibilityAndNewMessageIndicator(): void {
    const messageListElement: HTMLElement = this.messageList.nativeElement;
    const isAtBottom = messageListElement.scrollHeight - messageListElement.scrollTop <= messageListElement.clientHeight;
    this.showScrollButton = !isAtBottom;
    if (this.showNewMessageIndicator) {
      this.showNewMessageIndicator = !isAtBottom;
    }
  }

  scrollToBottomSmoothly(delay: number): void {
    setTimeout(() => {
      try {
        this.messageList.nativeElement.scrollTo({
          top: this.messageList.nativeElement.scrollHeight,
          behavior: 'smooth'
        });
      } catch (err) {
        console.error('Error scrolling to bottom:', err);
      }
    }, delay);
  }

  private getChannelMessages(): void {
    this.messageService.getChannelMessages(this.channelId).pipe(
      catchError((error) => {
        console.error('Error loading channel messages:', error);
        return throwError('Failed to load channel messages.');
      })
    ).subscribe((messages: Message[]) => {
      this.messages = messages;
      this.messages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      this.messagesToDisplay = messages;
      let scrollWait = messages.length * 5;
      if(scrollWait > this.maxScrollWait)
        scrollWait = this.maxScrollWait;
      this.scrollToBottomSmoothly(this.maxScrollWait);
    });
  }

  onSubmit(data: { text: string, file: File | null }): void {
    const message = data.text;
    this.selectedFile = data.file;
    if (this.messageService.isModifying()) {
      this.sendUpdateMessage(message);
      this.messageService.setModifying(false);
    } else if (this.messageService.isReplying()) {
      this.sendReplyMessage(message);
      this.messageService.setReplying(false);
      this.scrollToBottomSmoothly(100);
    } else {
      this.sendMessage(message);
      this.scrollToBottomSmoothly(100);
    }
  }

  sendUpdateMessage(message: string): void {
    this.messageService.updateMessage(this.messageService.getReplyingTo(), message).subscribe();
  }

  sendReplyMessage(message: string): void {
    if (message !== "") {
      const newMessage = new Message(
        uuidv4(),
        this.messageService.getReplyingTo(),
        message,
        this.authorMessage,
        new Date().toISOString(),
        new Date().toISOString(),
        this.channelId,
        this.selectedFile,
        this.channelId
      );
      const formData = new FormData();
      formData.append("message", new Blob([JSON.stringify(newMessage)], { type: 'application/json' }));
      formData.append("attachment", this.selectedFile ? this.selectedFile : new Blob());
      this.messageService.addMessage(formData, this.channelId).subscribe();
      this.removeFile();
    }
  }

  sendMessage(message: string): void {
    if (message !== "") {
      const newMessage = new Message(
        uuidv4(),
        null,
        message,
        this.authorMessage,
        new Date().toISOString(),
        new Date().toISOString(),
        this.channelId,
        this.selectedFile,
        this.channelId
      );
      const formData = new FormData();
      formData.append("message", new Blob([JSON.stringify(newMessage)], { type: 'application/json' }));
      formData.append("attachment", this.selectedFile ? this.selectedFile : new Blob());
      this.messageService.addMessage(formData, this.channelId).subscribe();
      this.removeFile();
    }
  }

  removeFile(): void {
    this.fileAttached = false;
    this.selectedFile = null;
  }

  getMessageById(id: string | null): Message | undefined {
    if (!id) return undefined;

    return this.messages.find(m => m.id === id);
  }

}


