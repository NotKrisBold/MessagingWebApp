import { Component } from '@angular/core';
import { Channel } from '../channel';
import { ChannelserviceService } from '../channelservice.service';
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

  constructor(private service: ChannelserviceService) { }

  ngOnInit() {
    this.getChannels();
  }

  getChannels(): void {
    this.service.getChannels()
      .subscribe(channels => {this.channels = channels});
  }

}
