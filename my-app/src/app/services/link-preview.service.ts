import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import * as cheerio from 'cheerio';
import { LinkPreview } from '../models/link-preview';

@Injectable({
  providedIn: 'root'
})
export class LinkPreviewService {
  constructor(private http: HttpClient) { }

  private getLinkPreview(url: string): Observable<LinkPreview> {
    return this.http.get(url, { responseType: 'text' })
      .pipe(
        map((html: string) => this.extractOpenGraphData(html, url))
      );
  }

  private extractOpenGraphData(html: string, url: string): LinkPreview {
    const $ = cheerio.load(html);
    const title = $('meta[property="og:title"]').attr('content');
    const description = $('meta[property="og:description"]').attr('content');
    const image = $('meta[property="og:image"]').attr('content');
    return new LinkPreview(title, description, image, url);
  }

  fetchLinkPreviews(messageBody: string): Observable<LinkPreview> | undefined {
    const link = this.extractLink(messageBody);
    if (link) { 
      return this.getLinkPreview(link);
    }
    return undefined;
  }

  private extractLink(message: string): string | null {
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Execute the regex on the message
    const matches = message.match(urlRegex);

    // Check if any matches are found
    if (matches && matches.length > 0) {
      // Return the first match (assuming the message contains only one link)
      return matches[0];
    } else {
      return null; // No link found in the message
    }
  }
}
