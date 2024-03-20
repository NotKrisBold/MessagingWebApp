import { Routes } from '@angular/router';
import { MessagesComponent } from './messages/messages.component';
import { ChannellistComponent } from './channellist/channellist.component';

export const routes: Routes = [{ path: 'channel/:id', component: MessagesComponent}];
