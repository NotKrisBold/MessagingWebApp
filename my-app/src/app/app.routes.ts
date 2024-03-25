import { Routes } from '@angular/router';
import { MessagesComponent } from './messages/messages.component';

export const routes: Routes = [{
    path: 'messages',
    loadChildren: () => import('./messages/messages.component').then(m => m.MessagesComponent)
  }];
