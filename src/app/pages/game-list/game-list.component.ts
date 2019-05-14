import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/domain/Role';
import { Player } from 'src/app/domain/Player';
import { Game } from 'src/app/domain/Game';
import { Card } from 'src/app/domain/Card';
import { GameService } from 'src/app/services/game.service';
import { Router } from '@angular/router';
import { BoardUtils } from 'src/app/components/board/utils';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameList implements OnInit {
  games: Game[];

  constructor(private gameService: GameService,
              private router: Router) {}

  ngOnInit() {
    this.gameService.listGames()
      .subscribe((games) => this.games = games);
  }

  getWaitingPlayers(game: Game) {
    const numWaiting = game.selectedRoles.length - 3 - game.players.length;
    return new Array(numWaiting);
  }

  getPlayerClass(idx: number) {
    return BoardUtils.getPlayerClass(idx);
  }

  getCard(role: Role) {
    return new Card('', role, true);
  }

  canJoin(game: Game) {
    return this.getWaitingPlayers(game).length > 0;
  }

  newGame() {
    this.router.navigate(['games', 'new']);
  }

  join(game: Game) {
    this.router.navigate(['games', game.id, 'join']);
  }
}
