import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import * as cheerio from 'cheerio';

@Injectable({
  providedIn: 'root'
})
export class LinkPreviewService {
  constructor(private http: HttpClient) { }

  getLinkPreview(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'text' })
      .pipe(
        map((html: string) => this.extractOpenGraphData(html))
      );
  }

  private extractOpenGraphData(html: string): any {
    const $ = cheerio.load(html);
    const title = $('meta[property="og:title"]').attr('content');
    const description = $('meta[property="og:description"]').attr('content');
    const image = $('meta[property="og:image"]').attr('content');
    
    return { title, description, image };
  }
}
