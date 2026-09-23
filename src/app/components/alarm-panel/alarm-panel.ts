import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlarmData } from '../../services/iot';

@Component({
  selector: 'app-alarm-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alarm-panel.html',
  styleUrl: './alarm-panel.scss'
})
export class AlarmPanelComponent {
  @Input() alarms: AlarmData[] = [];

  fmtTs(ts: number): string {
    return new Date(ts * 1000).toLocaleTimeString('en-GB', { hour12: false });
  }
}