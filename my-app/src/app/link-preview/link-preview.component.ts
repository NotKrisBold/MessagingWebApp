// link-preview.component.ts

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-link-preview',
  templateUrl: './link-preview.component.html',
  styleUrls: ['./link-preview.component.css'],
  standalone: true
})
export class LinkPreviewComponent {
  @Input() url: string | undefined; 
  @Input() title: string | undefined; 
  @Input() description: string| undefined;
  @Input() image: string | undefined; 
  @Input() error: string | undefined;
}
