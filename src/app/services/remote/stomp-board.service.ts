import { BoardService } from '../board.service';
import { Game, GameRef } from 'src/app/domain/Game';
import { Observable, Subject } from 'rxjs';
import { Board, PlayerBoard, Phase } from 'src/app/domain/Board';
import { RxStompService } from '@stomp/ng2-stompjs';
import { map, first } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Role } from 'src/app/domain/Role';
import { Card } from 'src/app/domain/Card';
import { Action } from 'src/app/domain/Action';
import { Player, PlayerRef } from 'src/app/domain/Player';
import { IPublishParams } from '@stomp/stompjs';
import { StompHelper } from './stomp-helper';


interface ServerCardsSwitched {
  card1Id: string;
  card2Id: string;
}

interface ServerPlayerBoard {
  playerId: string;
  originalRole: Role;
  cards: Card[];
  movements: ServerCardsSwitched[];
}

interface ServerBoard {
  remainingDiscussionDuration: number;
  remainingVoteDuration: number;
  currentRole: Role;
  distributed: boolean;
  started: boolean;
  ended: boolean;
  phase: string;
  boardsPerPlayerId: Map<string, ServerPlayerBoard>;
  allPlayerBoards: ServerPlayerBoard[];
}


@Injectable()
export class StompBoardService implements BoardService {
  constructor(private rxStompService: RxStompService,
              private stompHelper: StompHelper) {}

  public getBoard(game: GameRef, player: PlayerRef): Observable<Board> {
    return this.stompHelper.watchAndPublish(`games/${game.id}/board`).pipe(
      map((m) => JSON.parse(m.body)),
      map((board) => this.filterBoardForPlayer(board, player.id))
    );
  }

  public execute(game: GameRef, player: PlayerRef, action: Action): Observable<any> {
    return this.stompHelper.publishWithReceipt(`games/${game.id}/players/${player.id}/play`, {
      body: JSON.stringify(action)
    });
  }

  public distribute(game: GameRef): Observable<any> {
    return this.stompHelper.watchAndPublish(`games/${game.id}/distribute`).pipe(
      first()
    );
  }

  public startGame(game: GameRef): Observable<any> {
    return this.stompHelper.watchAndPublish(`games/${game.id}/start`).pipe(
      first()
    );
  }

  public gameRestarted(game: GameRef): Observable<any> {
    return this.rxStompService.watch(`/topic/games/${game.id}/restarted`);
  }

  private filterBoardForPlayer(board: ServerBoard, playerId: string): Board {
    return new Board(board.remainingDiscussionDuration,
      board.remainingVoteDuration,
      board.currentRole,
      playerId
        ? this.mapPlayerBoard(board.boardsPerPlayerId[playerId])
        : this.mapPlayerBoard(board.allPlayerBoards[0], true),
      board.distributed,
      board.started,
      board.ended,
      Phase[board.phase as keyof typeof Phase]);
  }

  private mapPlayerBoard(raw: ServerPlayerBoard, hideCards = false) {
    if (hideCards) {
      raw.cards.forEach((c) => c.visible = false);
    }
    return new PlayerBoard(raw.playerId, raw.originalRole, raw.cards, raw.movements);
  }
}
