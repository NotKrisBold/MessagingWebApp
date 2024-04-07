import { Message } from './message';

describe('Message', () => {
  it('should create an instance', () => {
    expect(new Message("12", null, "ciao", "francesco", "12", "12", 12, null, 12)).toBeTruthy();
  });
});
