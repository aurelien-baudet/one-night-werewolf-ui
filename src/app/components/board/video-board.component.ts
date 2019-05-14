import { Component, OnInit, Input } from '@angular/core';
import { PlayerRef, Player } from 'src/app/domain/Player';
import { BoardUtils } from './utils';
import { PlayerVideoStream } from 'src/app/domain/Video';

@Component({
  selector: 'app-video-board',
  templateUrl: './video-board.component.html',
  styleUrls: ['./video-board.component.scss']
})
export class VideoBoardComponent {

  @Input()
  numPlayers: number;
  @Input()
  players: Player[];
  @Input()
  streams: PlayerVideoStream[];


  getNumPlayersClass() {
    return BoardUtils.getNumPlayersClass(new Array(this.numPlayers));
  }

  getPlayerClass(idx: number) {
    return BoardUtils.getPlayerClass(idx);
  }
 
  getPlayerIdx(player: PlayerRef) {
    return this.players.findIndex((p) => p.id === player.id);
  }

}
