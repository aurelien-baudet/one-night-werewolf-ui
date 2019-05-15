import { Player, PlayerRef, NewPlayer } from '../domain/Player';
import { Observable, Subject } from 'rxjs';
import { Game, GameRef } from '../domain/Game';

export abstract class PlayerService {
  public abstract getPlayers(game: GameRef): Observable<Player[]>;
  public abstract addPlayer(game: GameRef, player: NewPlayer): Observable<Player>;
  public abstract removePlayer(game: GameRef, player: PlayerRef): Observable<void>;
}
