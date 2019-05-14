import { Component, OnInit, Input } from '@angular/core';
import { Card } from 'src/app/domain/Card';
import { Role } from 'src/app/domain/Role';

@Component({
  selector: 'app-night-progress',
  templateUrl: './night-progress.component.html',
  styleUrls: ['./night-progress.component.scss']
})
export class NightProgressComponent {
  @Input()
  roles: Role[];
  @Input()
  currentRole: Role;

  roleToCard(role: Role) {
    return new Card('', role, true);
  }
}
