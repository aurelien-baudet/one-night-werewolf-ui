import { Component, OnInit, Input } from '@angular/core';
import { Player } from 'src/app/domain/Player';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
  @Input()
  player: Player;

}
