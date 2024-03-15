import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataDisplayComponent } from './data-display/data-display.component';
import { MessagesComponent } from './messages/messages.component';
import { NavComponent } from './nav/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DataDisplayComponent,MessagesComponent, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Homes';
}


