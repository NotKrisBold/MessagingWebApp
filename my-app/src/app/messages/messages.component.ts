import { Component, Input, NgModule, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Channel } from '../channel';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ChannelserviceService } from '../channelservice.service';
import { CommonModule, NgIf } from '@angular/common';
import { Message } from '../message';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [HttpClientModule, NgIf, CommonModule, RouterModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})

export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  channel: Channel | undefined;
  authorMessage: any;
  messageBody : string = "";
  selectedFile: File | null = null;
  id: number = 0;
  constructor(
    private route: ActivatedRoute,
    private service: ChannelserviceService,
  ) {
    this.authorMessage = service.getAuthor();
  }


  ngOnInit(): void {
    console.log("ngoninit", this.authorMessage);
    this.route.params.subscribe(params => {
      const id = parseInt(params['id'], 10);
      console.log("subscribe",id);
      this.id = id;
      if (!isNaN(id)) {
        this.getChannelMessage(id);
      }
    });
  }

  getChannelMessage(id: number): void {
    this.service.getChannelMessages(id)
      .subscribe(messages => this.messages = messages);
  }

  onSubmit(message: string) {
    console.log("message:", this.messageBody);
    if(message != ""){
      const newMessage = new Message(
        '1',
        null,
        message,
        this.service.getAuthor(),
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
      this.service.addMessage(formdata, this.id).subscribe();
    }
  }

  onFileChange(event: any) {
    // Capture the selected file
    this.selectedFile = event.target.files[0];
  }

  onKeyPress(event: KeyboardEvent, message: string) {
    // Check if Enter key is pressed
    if (event.key === 'Enter') {
      this.onSubmit(message);
    }
  }

  getFileUrl(): string {
    if (this.selectedFile) {
      return URL.createObjectURL(this.selectedFile);
    }
    return '';
  }

}

