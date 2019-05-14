import { Observable } from 'rxjs';
import { Board } from '../domain/Board';
import { Game, GameRef } from '../domain/Game';
import { Action } from '../domain/Action';
import { PlayerRef } from '../domain/Player';

export abstract class BoardService {
   public abstract getBoard(game: GameRef, player: PlayerRef): Observable<Board>;
   public abstract execute(game: GameRef, player: PlayerRef, action: Action): Observable<any>;

   public abstract distribute(game: GameRef): Observable<any>;
   public abstract startGame(game: GameRef): Observable<any>;

   public abstract gameRestarted(game: GameRef): Observable<void>;
}