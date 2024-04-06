import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../models/message';

@Injectable()
export class ToastService {
  timer: any;
  status: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private readonly duration = 4000;
  constructor() { }

  showToast(msg: Message){
    if(this.timer){
      clearTimeout(this.timer);
    }

    this.status.next(msg);
    this.timer = window.setTimeout(()=>{
      this.status.next(null);
    },this.duration)
  }
}
