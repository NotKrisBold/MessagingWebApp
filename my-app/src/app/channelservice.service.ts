import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { Channel } from './channel';
import { Message } from './message';

@Injectable({
  providedIn: 'root'
})
export class ChannelserviceService {
  private author = "nome";
  private channelUrl = 'https://supsi-ticket.cloudns.org/supsi-chat/bff/channels';
  private HttpClient = inject(HttpClient);
  private messageUrl = "https://supsi-ticket.cloudns.org/supsi-chat/bff/channels/";
  private apiKey = "/messages?apiKey=boldini-elaidy";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data'})
  };

  getChannels(): Observable<Channel[]> {
    return this.HttpClient.get<Channel[]>(this.channelUrl);
  }

  getChannelMessages(id: number): Observable<Message[]> {
    const url = `${this.messageUrl}${id}${this.apiKey}`;
    return this.HttpClient.get<Message[]>(url);
  }


  addMessage(formData: FormData,id: number):Observable<Message>{
    const url = `${this.messageUrl}${id}${this.apiKey}`;
    return this.HttpClient.post<any>(url, formData);
  }
  getAuthor(){
    return this.author;
  }
  setAuthor(nome: string){
    this.author = nome;
  }

}
