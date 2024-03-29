import { Component } from '@angular/core';
import { Channel } from '../models/channel';
import { ChannelserviceService } from '../services/channelservice.service';
import { RouterLink, RouterModule } from '@angular/router';
import { NgFor } from '@angular/common';



@Component({
  selector: 'app-channellist',
  standalone: true,
  imports: [RouterLink,RouterModule,NgFor],
  templateUrl: './channellist.component.html',
  styleUrl: './channellist.component.css'
})
export class ChannellistComponent {

  channels: Channel[] = [];
  currentChannel: Channel | undefined;

  constructor(private service: ChannelserviceService) { }

  ngOnInit() {
    this.getChannels();
    this.service.getCurrentChannel().subscribe(channel => this.currentChannel = channel);
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
