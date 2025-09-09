import { Component, OnInit } from '@angular/core';
import { AlertService, Alert } from '../alert.service';

@Component({
  selector: 'app-alert',
  template: `
    <div class="app-alert" *ngIf="current">
      <div [class]="'alert ' + current.type">{{ current.message }}</div>
    </div>
  `,
  styles: [`.app-alert { position: fixed; top: 16px; right: 16px; z-index: 1000; }
    .alert { padding: 8px 12px; border-radius: 4px; color: white; }
    .alert.info { background: #2196f3; }
    .alert.success { background: #4caf50; }
    .alert.error { background: #f44336; }
    .alert.warn { background: #ff9800; }
  `]
})
export class AppAlertComponent implements OnInit {
  current: Alert | null = null;
  constructor(private svc: AlertService) {}
  ngOnInit() {
    this.svc.alerts.subscribe(a => {
      this.current = a;
      setTimeout(() => (this.current = null), 4000);
    });
  }
}
