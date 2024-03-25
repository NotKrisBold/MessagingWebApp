import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.css'
})
export class MessageInputComponent {

  messageText: string = '';
  selectedFile: File | null = null;

  @Output() messageSent = new EventEmitter<{ text: string, file: File | null }>();

  constructor() { }

  sendMessage() {
    this.messageSent.emit({ text: this.messageText, file: this.selectedFile });
    this.messageText = '';
    this.selectedFile = null; 
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
}
