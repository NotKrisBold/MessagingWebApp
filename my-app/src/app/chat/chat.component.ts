import { Component, Input } from '@angular/core';
import { ChannellistComponent } from '../channellist/channellist.component';
import { MessagesComponent } from '../messages/messages.component';
import { NavComponent } from '../nav/nav.component';
import { RouterOutlet } from '@angular/router';
import { MessageServiceService } from '../services/message-service.service';
import { MessageInputComponent } from '../message-input/message-input.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [RouterOutlet,ChannellistComponent,MessagesComponent,NavComponent,MessageInputComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  @Input() author: string = 'Marvin Berry'; //non funziona non binda con il valore passato nel tag
  constructor(
    private service: MessageServiceService,
  ) {
    service.setAuthor(this.author);
    console.log("author:",this.author);
  }
}
