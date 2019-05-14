import { Injectable } from '@angular/core';
import { GameOptions, Game, GameRef } from 'src/app/domain/Game';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { PlayerService } from '../player.service';
import { Player, PlayerRef, NewPlayer } from 'src/app/domain/Player';

@Injectable({
  providedIn: 'root'
})
export class InMemoryPlayerService implements PlayerService {
  private players: Player[] = [];
  private players$: Subject<Player[]> = new BehaviorSubject([]);

  public getPlayers(game: GameRef): Observable<Player[]> {
    return this.players$;
  }

  public addPlayer(game: GameRef, player: NewPlayer): Observable<Player> {
    const newPlayer = new Player(Date.now() + '-' + Math.random(), player.name);
    this.players.push(newPlayer);
    this.players$.next(this.players);
    return of(newPlayer);
  }

  public removePlayer(game: GameRef, player: PlayerRef): Observable<void> {
    const idx = this.players.findIndex((p) => p.id === player.id);
    this.players.splice(idx, 1);
    this.players$.next(this.players);
    return of();
  }

}
