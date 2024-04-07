import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, NgModule, OnChanges, Output, SimpleChanges, ViewChild, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from '../models/message';
import { MessageServiceService } from '../services/message-service.service';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.css'
})
export class MessageInputComponent implements OnChanges{


  messageText: string = '';
  selectedFile: File | null = null;
  @Input() messageToReply: Message | undefined;
  @Output() messageSent = new EventEmitter<{ text: string, file: File | null }>();
  @ViewChild('inputFile') inputFile!: ElementRef;
  
  constructor(public messageService: MessageServiceService) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(this.messageService.isModifying() && this.messageToReply)
      this.messageText = this.messageToReply.body;  
  }

  sendMessage() {
    this.messageSent.emit({ text: this.messageText, file: this.selectedFile });
    this.messageText = '';
    this.selectedFile = null;
    this.messageToReply = undefined;
    this.clearFileInput();
  }

  clearFileInput() {
    // Reset the file input element
    if (this.inputFile && this.inputFile.nativeElement) {
        this.inputFile.nativeElement.value = '';
    }
}
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  clearMessageToReply() {
    this.messageService.setReplyingTo("");
    this.messageService.setModifying(false);
    this.messageService.setReplying(false);
    this.messageText = "";
  }
}
