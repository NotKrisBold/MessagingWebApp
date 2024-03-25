import { Routes } from '@angular/router';
import { MessagesComponent } from './messagesList/messages.component';

export const routes: Routes = [
  {
    path: 'messages',
    loadChildren: () => import('./messagesList/messages.component').then(m => m.MessagesComponent)
  },
  ];
