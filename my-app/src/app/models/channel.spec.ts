import { Channel } from './channel';

describe('Channel', () => {
  it('should create an instance', () => {
    expect(new Channel(1, "channelName")).toBeTruthy();
  });
});
