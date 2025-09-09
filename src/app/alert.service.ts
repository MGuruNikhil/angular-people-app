import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface Alert {
  type: 'info' | 'success' | 'error' | 'warn';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private subject = new Subject<Alert>();

  get alerts(): Observable<Alert> {
    return this.subject.asObservable();
  }

  show(type: Alert['type'], message: string) {
    this.subject.next({ type, message });
  }

  info(message: string) { this.show('info', message); }
  success(message: string) { this.show('success', message); }
  error(message: string) { this.show('error', message); }
  warn(message: string) { this.show('warn', message); }
}
