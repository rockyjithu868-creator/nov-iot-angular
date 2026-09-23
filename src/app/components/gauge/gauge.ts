import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gauge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gauge.html',
  styleUrl: './gauge.scss'
})
export class GaugeComponent implements OnChanges {
  @Input() tag = '';
  @Input() value = 0;
  @Input() unit = '';
  @Input() min = 0;
  @Input() max = 100;
  @Input() alarmState: 'hi' | 'lo' | null = null;

  arcPath = '';
  bgPath = '';
  color = '#f59e0b';

  ngOnChanges() {
    this.buildArc();
  }

  buildArc() {
    const cx = 60, cy = 62, r = 48;
    const pct = Math.max(0, Math.min(1, (this.value - this.min) / (this.max - this.min)));
    this.color = this.alarmState === 'hi' ? '#ef4444' : this.alarmState === 'lo' ? '#f59e0b' : '#f59e0b';
    this.bgPath  = this.describeArc(cx, cy, r, -210, 30);
    this.arcPath = pct > 0 ? this.describeArc(cx, cy, r, -210, -210 + 240 * pct) : '';
  }

  polar(cx: number, cy: number, r: number, deg: number) {
    const rad = (deg - 90) * Math.PI / 180;
    return { x: +(cx + r * Math.cos(rad)).toFixed(2), y: +(cy + r * Math.sin(rad)).toFixed(2) };
  }

  describeArc(cx: number, cy: number, r: number, start: number, end: number) {
    const s = this.polar(cx, cy, r, start);
    const e = this.polar(cx, cy, r, end);
    const large = (end - start + 360) % 360 > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  }
}