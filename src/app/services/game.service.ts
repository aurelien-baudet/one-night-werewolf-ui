import { GameOptions, Game } from '../domain/Game';
import { Observable } from 'rxjs';
import { Role } from '../domain/Role';
import { Player } from '../domain/Player';

export abstract class GameService {
  public abstract newGame(seletecedRoles: Role[], options: GameOptions): Observable<Game>;
  public abstract replayGame(game: Game): Observable<Game>;

  public abstract getGame(gameId: string): Observable<Game>;
  public abstract listGames(): Observable<Game[]>;
}
