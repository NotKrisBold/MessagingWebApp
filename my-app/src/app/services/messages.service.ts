import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { ChannelserviceService } from './channelservice.service';
import { MessageServiceService } from './message-service.service';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  
  constructor(
    private http: HttpClient,
    private channelService: ChannelserviceService,
    private messageService: MessageServiceService
  ) { }

  searchMessages(term: string): Observable<Message[]> {
    return this.channelService.getCurrentChannel().pipe(
      switchMap(currentChannel => {
        if (!term.trim() || currentChannel === undefined) {
          return of([]); // Returning empty array if term is empty or currentChannel is undefined
        }
        return this.messageService.getChannelMessages(currentChannel.id).pipe(
          tap(messages => messages.length ?
             this.log(`found messages matching "${term}"`) :
             this.log(`no messages matching "${term}"`)),
          catchError(this.handleError<Message[]>('searchHeroes', [])),
          switchMap(messages => {
            const filteredMessages = messages.filter(message => message.body.includes(term));
            const sortedMessages = filteredMessages.sort((a, b) => {
              return new Date(a.date).getTime() - new Date(b.date).getTime();
            });
            return of(sortedMessages);
          })
        );
      })
    );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(message); // log message
  }
}