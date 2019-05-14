import { Component, OnInit, Input } from '@angular/core';
import { Duration } from "luxon";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {
  @Input()
  durationMs: number;
  @Input()
  format: string;

  formatDuration(): string {
    return Duration.fromMillis(this.durationMs).toFormat(this.format);
  }
}
