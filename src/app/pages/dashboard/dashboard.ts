import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IotService, TagData, AlarmData } from '../../services/iot';
import { GaugeComponent } from '../../components/gauge/gauge';
import { TagTableComponent } from '../../components/tag-table/tag-table';
import { AlarmPanelComponent } from '../../components/alarm-panel/alarm-panel';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, GaugeComponent, TagTableComponent, AlarmPanelComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  tags: Record<string, TagData> = {};
  alarms: AlarmData[] = [];
  connected = false;
  clock = '';

  readonly TAG_RANGES: Record<string, [number, number]> = {
    'Wellhead Pressure': [2000, 3000],
    'Flow Rate':         [0, 1200],
    'Pump Speed':        [0, 1500],
    'Casing Pressure':   [1000, 2500],
    'Motor Temperature': [0, 120],
    'Gas Concentration': [0, 500]
  };

  constructor(public iot: IotService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.iot.tags$.subscribe(t => {
      this.tags = { ...t };
      this.cdr.detectChanges();
    });
    this.iot.alarms$.subscribe(a => {
      this.alarms = [...a];
      this.cdr.detectChanges();
    });
    this.iot.connected$.subscribe(c => {
      this.connected = c;
      this.cdr.detectChanges();
    });
    setInterval(() => {
      this.clock = new Date().toLocaleTimeString('en-GB', { hour12: false });
      this.cdr.detectChanges();
    }, 1000);
  }

  get tagEntries() {
    return Object.entries(this.tags).map(([name, data]) => ({
      name, ...data,
      min: this.TAG_RANGES[name]?.[0] ?? 0,
      max: this.TAG_RANGES[name]?.[1] ?? 100
    }));
  }
}