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
      if (!isNaN(id)) {
        this.getChannelMessage(id);
      }
    });
  }

  getChannelMessage(id: number): void {
    this.service.getChannelMessages(id)
      .subscribe(messages => this.messages = messages);
  }

  onSubmit() {
    const message = new Message(
      '1',
      null,
      this.messageBody,
      this.service.getAuthor(),
      new Date().toISOString(),
      new Date().toISOString(),
      1,
      null
    );

    console.log("invio");
    const formdata = new FormData();
    formdata.append("message", new Blob([JSON.stringify(message)], { type: 'application/json' }));
    formdata.append("attachment", this.selectedFile ? this.selectedFile: new Blob());
    formdata.forEach((data) => console.log(data));
    this.service.addMessage(formdata, 1).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  onFileChange(event: any) {
    // Capture the selected file
    this.selectedFile = event.target.files[0];
  }

}

