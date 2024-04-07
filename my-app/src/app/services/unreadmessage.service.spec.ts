import { TestBed } from '@angular/core/testing';

import { UnreadmessageService } from './unreadmessage.service';

describe('UnreadmessageService', () => {
  let service: UnreadmessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnreadmessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
