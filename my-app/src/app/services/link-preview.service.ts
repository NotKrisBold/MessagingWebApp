import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
        map((html: string) => this.extractOpenGraphData(html, url)),
        catchError(() => EMPTY) // Ignora l'errore e restituisci un observable vuoto
      );
  }

  private extractOpenGraphData(html: string, url: string): LinkPreview {
    const $ = cheerio.load(html);
    const title = $('meta[property="og:title"]').attr('content');
    const description = $('meta[property="og:description"]').attr('content');
    const image = $('meta[property="og:image"]').attr('content');
    return new LinkPreview(title, description, image, url);
  }

  fetchLinkPreview(messageBody: string): Observable<LinkPreview> | undefined {
    const link = this.extractLink(messageBody);
    if (link) { 
      return this.getLinkPreview(link);
    }
    return undefined;
  }

  private extractLink(message: string): string | null {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = message.match(urlRegex);
    return matches && matches.length > 0 ? matches[0] : null;
  }
}
