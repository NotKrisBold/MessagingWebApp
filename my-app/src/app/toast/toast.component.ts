import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { Message } from '../models/message';
import { MessageServiceService } from '../services/message-service.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  providers: []
})
export class ToastComponent implements OnInit {
  showToast = false;
  toastBody = "";
  toastAuthor = "";

  constructor(private toastService: ToastService,private messageService: MessageServiceService) {

  }

  ngOnInit(): void {
    this.toastService.status.subscribe((msg: Message) => {
      if (msg === null)
        this.showToast = false;
      else if(msg.author == this.messageService.getAuthor()){
          if(this.showToast=== true){
            return;
          }
          this.showToast = false;
        }
        else{
          this.showToast = true;
          this.toastAuthor = msg.author;
          this.toastBody = msg.body;
        }
    });
  }

  closeToast() {
    this.showToast = false;
  }


}
