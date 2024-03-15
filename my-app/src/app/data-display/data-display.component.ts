import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';

export interface Channel{
  id: number;
  name: string;
}
@Component({
  selector: 'app-data-display',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './data-display.component.html',
  styleUrl: './data-display.component.css'
})
export class DataDisplayComponent implements OnInit{
  dataArray: any[] = [];
  channels: Channel[] = [];
  httpclient = inject(HttpClient);

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(){
    this.httpclient.get("https://supsi-ticket.cloudns.org/supsi-chat/bff/channels").subscribe((data: any) => {  
    this.dataArray = data;
    for(let i = 0; i < this.dataArray.length; i++){
      this.channels[i].id = this.dataArray[i].id;
      this.channels[i].name = this.dataArray[i].name;
      console.log(this.channels[i].name);
    }
  }, (error) => {
    console.log("No channels found", error);
  });
}
}
