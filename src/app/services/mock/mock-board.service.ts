import { BoardService } from '../board.service';
import { Game, GameRef } from 'src/app/domain/Game';
import { Observable, of } from 'rxjs';
import { Board, PlayerBoard, Phase } from 'src/app/domain/Board';
import { Injectable } from '@angular/core';
import { Player, PlayerRef } from 'src/app/domain/Player';
import { Action, SwitchCards } from 'src/app/domain/Action';
import { Card, InTheMiddle, InFrontOfPlayer } from 'src/app/domain/Card';
import { Role } from 'src/app/domain/Role';

@Injectable()
export class MockBoardService implements BoardService {
    public distribute(game: GameRef): Observable<any> {
        return of(new Board(
            3000,
            2000,
            null,
            new PlayerBoard("1", new Role('seer', ''), this.getCards(), []),
            true,
            false,
            false,
            null
        ))
    }
    public startGame(game: GameRef): Observable<any> {
        return of();
    }
    public execute(game: GameRef, player: PlayerRef, action: Action): Observable<any> {
        return of();
    }
    public getBoard(game: GameRef, player: PlayerRef): Observable<Board> {
        // // distributed
        // return of(new Board(
        //     3000,
        //     2000,
        //     null,
        //     new PlayerBoard("1", null, this.getCards(), []),
        //     true,
        //     false,
        //     false,
        //     null
        // ))
        // AWAKE
        return of(new Board(
            3000,
            2000,
            new Role('werewolf', ''),
            new PlayerBoard("1", new Role('seer', ''), this.getCards(), []),
            true,
            true,
            false,
            Phase.AWAKE
        ))
        // // SUNRISE
        // return of(new Board(
        //     3000,
        //     2000,
        //     null,
        //     new PlayerBoard("1", new Role('seer', ''), this.getCards(), []),
        //     true,
        //     true,
        //     false,
        //     Phase.SUNRISE
        // ))
        // // DISCUSS
        // return of(new Board(
        //     3000,
        //     2000,
        //     null,
        //     new PlayerBoard("1", new Role('seer', ''), this.getCards(), []),
        //     true,
        //     true,
        //     false,
        //     Phase.DISCUSS
        // ))
        // VOTE
        // return of(new Board(
        //     0,
        //     2000,
        //     null,
        //     new PlayerBoard("1", new Role('seer', ''), this.getCards(), []),
        //     true,
        //     true,
        //     false,
        //     Phase.VOTE
        // ))
        // // END OF GAME
        // return of(new Board(
        //     0,
        //     0,
        //     null,
        //     new PlayerBoard("1", new Role('seer', ''), this.getCards(), []),
        //     true,
        //     true,
        //     true,
        //     Phase.VOTE
        // ))
    }

    public gameRestarted(game: GameRef): Observable<void> {
        return of();
    }

    private getCards() {
        return [
            new Card('werewolf1', new Role('werewolf', ''), false, new InTheMiddle(0)),
            new Card('werewolf2', new Role('werewolf', ''), false, new InTheMiddle(2)),
            new Card('seer', new Role('seer', ''), false, new InFrontOfPlayer("1")),
            new Card('troublemaker', new Role('troublemaker', ''), false, new InFrontOfPlayer("5")),
            new Card('robber', new Role('robber', ''), false, new InTheMiddle(1)),
            new Card('drunk', new Role('drunk', ''), false, new InFrontOfPlayer("3")),
            new Card('tanner', new Role('tanner', ''), false, new InFrontOfPlayer("4")),
            new Card('insomniac', new Role('insomniac', ''), false, new InFrontOfPlayer("2")),
        ]
    }
}