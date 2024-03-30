import { CommonModule } from '@angular/common';
import { Component, Input, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Message } from '../models/message';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  messages$!: Observable<Message[]>
  private searchTerms = new Subject<string>();

  @ViewChild('messageContainer') messageContainer!: ElementRef;

  constructor(private messagesService: MessagesService) {}

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.messages$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.messagesService.searchMessages(term)),
    );

    // Subscribe to messages$ and scroll to the first message
    this.messages$.subscribe(messages => {
      if (messages.length > 0) {
        setTimeout(() => { // Add a timeout to ensure the view is updated
          this.scrollToFirstMessage();
        });
      }
    });
  }

  scrollToFirstMessage(): void {
    console.log('Scrolling to first message');
    if (this.messageContainer && this.messageContainer.nativeElement) {
      const firstMessageElement = this.messageContainer.nativeElement.querySelector('li:first-child');
      console.log('First message element:', firstMessageElement);
      if (firstMessageElement) {
        firstMessageElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      } else {
        console.log('No first message element found');
      }
    } else {
      console.log('Message container not found');
    }
  }    @Input() isVisible: boolean = false;
}
