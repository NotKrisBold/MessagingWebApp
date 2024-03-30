import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Channel } from '../models/channel';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { Message } from '../models/message';
import { v4 as uuidv4 } from 'uuid';
import { MessageServiceService } from '../services/message-service.service';
import { MessageInputComponent } from "../message-input/message-input.component";
import { ChannelserviceService } from '../services/channelservice.service';
import { MessageComponent } from '../message/message.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
@Component({
    selector: 'app-messages',
    standalone: true,
    templateUrl: './messages.component.html',
    styleUrl: './messages.component.css',
    imports: [HttpClientModule, NgIf, CommonModule, RouterModule, MessageInputComponent,MessageComponent]
})

export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  channel: Channel | undefined;
  authorMessage: any;
  messageBody : string = "";
  selectedFile: File | null = null;
  fileAttached: boolean = false;
  channelId: number = 0;
  filteredMessages: Message[] = [];
  searchTerms: Subject<string> = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageServiceService,
    private channelService: ChannelserviceService
  ) {
    this.authorMessage = messageService.getAuthor();
    this.selectedFile ? this.selectedFile: new Blob();
  }


  ngOnInit(): void {
    this.channelService.getCurrentChannel().subscribe(channel => {
      if(channel?.id){
        this.channelId = channel.id;
        this.getChannelMessages();
      }
    }, (error) => {
      console.error('Error loading messages:', error);
    });

    // Subscribe to search terms to trigger search when a term is emitted
    this.searchTerms.pipe(
      debounceTime(300), // Wait for 300ms after user stops typing
      distinctUntilChanged() // Only trigger search if the term has changed
    ).subscribe(term => {
      this.filterMessages(term);
    });
  }

  filterMessages(term: string): void {
    if (!term.trim()) {
      // If the search term is empty, display all messages
      this.filteredMessages = [...this.messages];
      return;
    }

    // Filter messages based on the search term
    this.filteredMessages = this.messages.filter(message =>
      message.author.toLowerCase().includes(term.toLowerCase()) ||
      message.body.toLowerCase().includes(term.toLowerCase())
    );
  }
  search(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.filteredMessages = this.messages.filter(message =>
      message.author.toLowerCase().includes(term.toLowerCase()) ||
      message.body.toLowerCase().includes(term.toLowerCase())
    );
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
    if(this.messageService.isModifying()){
      this.sendUpdateMessage(message);
      this.messageService.setModifying(false);
    }
    else if(this.messageService.isReplying()){
      this.sendReplyMessage(message);
      this.messageService.setReplying(false);
    }
    else
      this.sendMessage(message);
  }

  sendUpdateMessage(message: string){
    this.messageService.updateMessage(this.messageService.getReplyingTo(),message).subscribe();
  }

  sendReplyMessage(message: string){
    if(message != ""){
      const newMessage = new Message(
        uuidv4(),
        this.messageService.getReplyingTo(),
        message,
        this.messageService.getAuthor(),
        new Date().toISOString(),
        new Date().toISOString(),
        1,
        this.selectedFile
      );
      const formdata = new FormData();
      formdata.append("message", new Blob([JSON.stringify(newMessage)], { type: 'application/json' }));
      formdata.append("attachment", this.selectedFile ? this.selectedFile: new Blob());
      console.log(this.selectedFile);
      formdata.forEach((data) => console.log(data));
      this.messageService.addMessage(formdata, this.channelId).subscribe();
      this.removeFile();
    }
  }

  sendMessage(message: string){
    if(message != ""){
      const newMessage = new Message(
        uuidv4(),
        null,
        message,
        this.messageService.getAuthor(),
        new Date().toISOString(),
        new Date().toISOString(),
        1,
        this.selectedFile
      );
      console.log("message id:",newMessage.id);
      const formdata = new FormData();
      formdata.append("message", new Blob([JSON.stringify(newMessage)], { type: 'application/json' }));
      formdata.append("attachment", this.selectedFile ? this.selectedFile: new Blob());
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

  getMessageById(id: string): Message | undefined {
    return this.messages.find(message => message.id === id);
  }
  
}


