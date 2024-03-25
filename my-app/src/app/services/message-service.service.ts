import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageServiceService {
  private author = "nome";
  private messageUrl = "https://supsi-ticket.cloudns.org/supsi-chat/bff/channels/";
  private apiKey = "?apiKey=boldini-elaidy";
  private messageUpdateUrl = "https://supsi-ticket.cloudns.org/supsi-chat/bff/messages/"

  private HttpClient = inject(HttpClient);
  

  getChannelMessages(id: number): Observable<Message[]> {
    const url = `${this.messageUrl}${id}/messages${this.apiKey}`;
    return this.HttpClient.get<Message[]>(url);
  }

  addMessage(formData: FormData,id: number):Observable<Message>{
    const url = `${this.messageUrl}${id}/messages${this.apiKey}`;
    return this.HttpClient.post<any>(url, formData);
  }

  updateMessage(id: string,body: string): Observable<object> {
    const url = `${this.messageUpdateUrl}${id}/body${this.apiKey}`;
    console.log(url);
    const newBody = { body } ;
    console.log("updated");
    return this.HttpClient.put(url, newBody);
  }

  getAuthor(){
    return this.author;
  }

  setAuthor(nome: string){
    this.author = nome;
  }
}