import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TagData {
  value: number;
  unit: string;
  ts: number;
  alarmState?: 'hi' | 'lo' | null;
}

export interface AlarmData {
  tag: string;
  message: string;
  severity: 'high' | 'low';
  ts: number;
}

@Injectable({ providedIn: 'root' })
export class IotService {
  private apiUrl = 'https://nov-iot-demo.onrender.com';
  private wsUrl  = 'wss://nov-iot-demo.onrender.com/ws';
  private ws!: WebSocket;
  private pingInterval: any;

  tags$      = new BehaviorSubject<Record<string, TagData>>({});
  alarms$    = new BehaviorSubject<AlarmData[]>([]);
  connected$ = new BehaviorSubject<boolean>(false);
  history$   = new BehaviorSubject<Record<string, {value:number,ts:number}[]>>({});

  constructor(private http: HttpClient) {
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.wsUrl);

    this.ws.onopen = () => {
      this.connected$.next(true);
      console.log('WebSocket connected to Render');
      // keepalive ping every 25 seconds
      this.pingInterval = setInterval(() => {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send('ping');
          console.log('ping sent');
        }
      }, 25000);
    };

    this.ws.onmessage = (event) => {
      if (event.data === 'pong') return;
      const msg = JSON.parse(event.data);
      console.log('WS message:', msg.type);

      if (msg.type === 'snapshot') {
        const current: Record<string, TagData> = {};
        Object.entries(msg.tags || {}).forEach(([k, v]: any) => {
          current[k] = { value: v.value, unit: v.unit, ts: v.ts, alarmState: null };
          const hist = this.history$.value;
          if (!hist[k]) hist[k] = [];
          hist[k].push({ value: v.value, ts: v.ts });
          this.history$.next({ ...hist });
        });
        this.tags$.next({ ...current });
        this.alarms$.next(msg.alarms || []);
        console.log('Snapshot tags:', Object.keys(current));
      }

      if (msg.type === 'tag_update') {
        const current = { ...this.tags$.value };
        const alarm = msg.alarm;
        current[msg.tag] = {
          value: msg.value,
          unit: msg.unit,
          ts: msg.ts,
          alarmState: alarm ? (alarm.severity === 'high' ? 'hi' : 'lo') : null
        };
        this.tags$.next(current);

        const hist = { ...this.history$.value };
        if (!hist[msg.tag]) hist[msg.tag] = [];
        hist[msg.tag] = [...hist[msg.tag], { value: msg.value, ts: msg.ts }];
        if (hist[msg.tag].length > 60) hist[msg.tag].shift();
        this.history$.next(hist);

        if (alarm) {
          const alarms = [alarm, ...this.alarms$.value].slice(0, 50);
          this.alarms$.next(alarms);
        }
      }
    };

    this.ws.onclose = () => {
      this.connected$.next(false);
      clearInterval(this.pingInterval);
      console.log('WebSocket closed, reconnecting in 3s...');
      setTimeout(() => this.connect(), 3000);
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };
  }

  getHistory(tag: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/history/${tag}`);
  }

  getAlarms(): Observable<AlarmData[]> {
    return this.http.get<AlarmData[]>(`${this.apiUrl}/api/alarms`);
  }
}