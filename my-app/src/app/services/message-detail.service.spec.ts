import { TestBed } from '@angular/core/testing';

import { MessageDetailService } from './message-detail.service';

describe('MessageDetailService', () => {
  let service: MessageDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
