import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageServiceService {
 
  private author = "";
  private url = "";
  private apiKey = "boldini-elaidy";
  private modifyingMessage = false;
  private replyingMessage = false;
  private HttpClient = inject(HttpClient);
  private replyingToId = "";

  getChannelMessages(id: number): Observable<Message[]> {
    const url = `${this.url}channels/${id}/messages?apiKey=${this.apiKey}`;
    return this.HttpClient.get<Message[]>(url);
  }

  addMessage(formData: FormData,id: number):Observable<Message>{
    const url = `${this.url}channels/${id}/messages?apiKey=${this.apiKey}`;
    return this.HttpClient.post<any>(url, formData);
  }

  updateMessage(id: string,body: string): Observable<object> {
    const url = `${this.url}messages/${id}/body?apiKey=${this.apiKey}`;
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

  isReplying(){
    return this.replyingMessage;
  }

  isModifying(){
    return this.modifyingMessage;
  }

  setReplying(bool: boolean){
    this.replyingMessage = bool;
  }

  setModifying(bool: boolean){
    this.modifyingMessage = bool;
  }

  setReplyingTo(id: string) {
    this.replyingToId = id;
  }

  getReplyingTo() {
    return this.replyingToId;
  }

  setUrl(url: string){
    this.url = url;
  }
  
}
