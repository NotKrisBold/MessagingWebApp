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
@Component({
    selector: 'app-messages',
    standalone: true,
    templateUrl: './messages.component.html',
    styleUrl: './messages.component.css',
    imports: [HttpClientModule, NgIf, CommonModule, RouterModule, MessageInputComponent]
})

export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  channel: Channel | undefined;
  authorMessage: any;
  messageBody : string = "";
  selectedFile: File | null = null;
  fileAttached: boolean = false;
  id: number = 0;
  updatingMessage = false;
  replyingMessage = false;
  messageId: string = "";
  parentMessageBody : string = "";

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
      this.getChannelMessage(channel?.id);
    });
  }

  getChannelMessage(channelId: number | undefined): void {
    if(channelId)
      this.messageService.getChannelMessages(channelId)
        .subscribe(messages => {
          this.messages = messages
        });
  }

  logMessages(){
    for(let message of this.messages){
      console.log(message);
    }
  }

  onSubmit(data: { text: string, file: File | null }) {
    console.log("sto inviando messaggio");
    const message = data.text;
    this.selectedFile = data.file;
    if(this.updatingMessage)
      this.sendUpdateMessage(message);
    else if(this.replyingMessage)
      this.sendReplyMessage(message);
    else
      this.sendMessage(message);
  }

  sendUpdateMessage(message: string){
    this.messageService.updateMessage(this.messageId,message).subscribe();
  }

  sendReplyMessage(message: string){
    this.replyingMessage = true;
    console.log("message:", this.messageBody);
    if(message != ""){
      const newMessage = new Message(
        uuidv4(),
        this.messageId,
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
      this.messageService.addMessage(formdata, this.id).subscribe();
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
      this.messageService.addMessage(formdata, this.id).subscribe();
      this.removeFile();
    }
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    this.updateFileAttachmentIndicator();
  }
  
  updateFileAttachmentIndicator() {
    if (this.selectedFile) {
      this.fileAttached = true;
    } else {
      this.fileAttached = false;
    }
  }

  removeFile() {
    this.fileAttached = false;
    this.selectedFile = null;
  }

  onKeyPress(event: KeyboardEvent, message: string) {
    // Check if Enter key is pressed
    if (event.key == 'Enter') {
     
    }
  }

  getFileUrl(): string {
    if (this.selectedFile) {
      return URL.createObjectURL(this.selectedFile);
    }
    return '';
  }
  
  updateMessage(id: string){
    this.stopUpdateMessageOrReply();
    this.updatingMessage = true;
    this.messageId = id;
  }

  stopUpdateMessageOrReply(){
    this.updatingMessage = false;
    this.messageId = "";
    this.messageId = "";
    this.replyingMessage = false;
  }

  reply(id: string){
    this.stopUpdateMessageOrReply();
    this.replyingMessage = true;
    this.messageId = id;
  }

  getMessageById(id: string | null): Message | undefined {
    return this.messages.find(message => message.id === id);
  }
}

