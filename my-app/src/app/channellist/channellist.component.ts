import { Component } from '@angular/core';
import { Channel } from '../models/channel';
import { ChannelserviceService } from '../services/channelservice.service';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { Subscription } from 'rxjs';
import { UnreadmessageService } from '../services/unreadmessage.service';

@Component({
  selector: 'app-channellist',
  standalone: true,
  imports: [RouterLink,RouterModule,CommonModule],
  templateUrl: './channellist.component.html',
  styleUrl: './channellist.component.css'
})
export class ChannellistComponent {

  channels: Channel[] = [];
  currentChannel: Channel | undefined;
  unreadCountSubscription: Subscription | undefined;
  unreadMessageCounts: { [channelId: number]: number } = {};

  constructor(private service: ChannelserviceService,private unreadService: UnreadmessageService) { }

  ngOnInit() {
    this.getChannels();
    this.service.getCurrentChannel().subscribe(channel => this.currentChannel = channel);
    this.unreadCountSubscription = this.unreadService.getUnreadCountObservable().subscribe({
      next: ({ channelId, count }) => {
        this.unreadMessageCounts[channelId] = count;
      }
    });
    
  }

  getChannels(): void {
    this.service.getChannels()
      .subscribe(channels => {
        this.channels = channels
      });
  }

  changeChannel(channelId: number){
    this.service.setCurrentChannel(this.getChannelById(channelId));
  }

  getChannelById(channelId: number): Channel | undefined{
    for(const channel of this.channels){
      if(channelId == channel.id){
        return channel;
      }
    }
    return undefined;
  }
}
