import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Message } from '../models/message';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageServiceService {
 
  private author = "";
  private url = "";
  private apiKey = environment.apiKey;
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
    const newBody = { body } ;
    return this.HttpClient.put(url, newBody);
  }

  search(channelId: number, term: String): Observable<Message[]> {
    const searchResult: Message[] = [];
    term = term.toLocaleLowerCase();
    if (!term) {
      return new Observable<Message[]>(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    return this.getChannelMessages(channelId).pipe(
      map((messages: any) => {
        for (const message of messages) {
          if (
            message.author.toLowerCase().includes(term) ||
            message.body.toLowerCase().includes(term)
          ) {
            searchResult.push(message);
          }
        }
        return searchResult;
      })
    );
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
