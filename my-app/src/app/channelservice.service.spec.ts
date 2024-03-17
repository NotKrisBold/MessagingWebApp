import { TestBed } from '@angular/core/testing';

import { ChannelserviceService } from './channelservice.service';

describe('ChannelserviceService', () => {
  let service: ChannelserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChannelserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
