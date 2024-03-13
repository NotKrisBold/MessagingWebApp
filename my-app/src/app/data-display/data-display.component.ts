import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-data-display',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './data-display.component.html',
  styleUrl: './data-display.component.css'
})
export class DataDisplayComponent implements OnInit{
  data: any[] = [];
  httpclient = inject(HttpClient);

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(){
    this.httpclient.get("https://supsi-ticket.cloudns.org/supsi-chat/bff/channels").subscribe((data: any) => {
      console.log(data);
      this.data = data;
    });
  }
}
