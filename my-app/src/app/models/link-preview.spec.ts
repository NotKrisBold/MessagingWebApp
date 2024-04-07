import { LinkPreview } from './link-preview';

describe('LinkPreview', () => {
  it('should create an instance', () => {
    expect(new LinkPreview("title", undefined, undefined, undefined)).toBeTruthy();
  });
});
