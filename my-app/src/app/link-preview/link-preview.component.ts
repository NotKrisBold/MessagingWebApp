// link-preview.component.ts

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-link-preview',
  templateUrl: './link-preview.component.html',
  styleUrls: ['./link-preview.component.css'],
  standalone: true
})
export class LinkPreviewComponent {
  @Input() url: string = ''; 
  @Input() title: string = ''; 
  @Input() description: string = '';
  @Input() image: string = ''; 
  @Input() error: string = '';
}
