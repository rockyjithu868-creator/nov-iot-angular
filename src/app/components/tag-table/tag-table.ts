import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagData } from '../../services/iot';

@Component({
  selector: 'app-tag-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag-table.html',
  styleUrl: './tag-table.scss'
})
export class TagTableComponent {
  @Input() tags: Record<string, TagData> = {};

  get tagList() {
    return Object.entries(this.tags).map(([name, data]) => ({ name, ...data }));
  }

  fmtTs(ts: number): string {
    return new Date(ts * 1000).toLocaleTimeString('en-GB', { hour12: false });
  }
}