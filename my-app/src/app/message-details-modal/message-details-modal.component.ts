import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { MessageDetailService } from '../services/message-detail.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-message-details-modal',
  imports: [CommonModule],
  templateUrl: './message-details-modal.component.html',
  styleUrls: ['./message-details-modal.component.css']
})
export class MessageDetailsModalComponent implements OnInit{
  message: Message | undefined;

  constructor(public messageDetailService: MessageDetailService) {}

  ngOnInit() {
    this.message = this.messageDetailService.message;
  }

  closeModal(){
    this.messageDetailService.showMessageDetails = false;
  }
}
