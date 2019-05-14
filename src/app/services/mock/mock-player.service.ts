import { Injectable } from '@angular/core';
import { GameOptions, Game, GameRef } from 'src/app/domain/Game';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { PlayerService } from '../player.service';
import { Player, PlayerRef, NewPlayer } from 'src/app/domain/Player';

@Injectable({
  providedIn: 'root'
})
export class MockPlayerService implements PlayerService {
  private players: Player[] = [
    new Player("1", "Yo"),
    new Player("2", "Cécé"),
    new Player("3", "Guigui"),
    new Player("4", "Roma"),
    new Player("5", "Moi")
  ];
  private players$: Subject<Player[]> = new BehaviorSubject([]);

  public getPlayers(game: GameRef): Observable<Player[]> {
    return of(this.players);
  }

  public addPlayer(game: GameRef, player: NewPlayer): Observable<Player> {
    return of({id: '1', name: player.name});
  }

  public removePlayer(game: GameRef, player: PlayerRef): Observable<void> {
    return of();
  }

}
