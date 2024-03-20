import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessagesComponent } from './messages/messages.component';
import { NavComponent } from './nav/nav.component';
import { HttpClientModule } from '@angular/common/http';
import { ChannellistComponent } from './channellist/channellist.component';
import { ChannelserviceService } from './channelservice.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MessagesComponent, NavComponent,ChannellistComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  author = "Marvin Berry";
  constructor(
    private service: ChannelserviceService,
  ) {
    service.setAuthor(this.author);
  }
}


