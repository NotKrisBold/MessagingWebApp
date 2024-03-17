import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessagesComponent } from './messages/messages.component';
import { NavComponent } from './nav/nav.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChannellistComponent } from './channellist/channellist.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MessagesComponent, NavComponent,ChannellistComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Homes';
}


