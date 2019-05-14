import { Component, OnInit, Input } from '@angular/core';
import { Role } from 'src/app/domain/Role';
import { Card } from 'src/app/domain/Card';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input()
  card: Card;
}
