import { Injectable } from '@angular/core';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageDetailService {
  showMessageDetails = false;
  message: Message | undefined;
  constructor() { }
}
