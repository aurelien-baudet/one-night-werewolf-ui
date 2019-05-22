import { Injectable } from '@angular/core';
import { GameService } from '../game.service';
import { Role } from 'src/app/domain/Role';
import { GameOptions, Game, DefaultGameOptions } from 'src/app/domain/Game';
import { Observable, of } from 'rxjs';
import { Player } from 'src/app/domain/Player';

@Injectable({
  providedIn: 'root'
})
export class MockGameService implements GameService {
  private games = new Map<string, Game>();

  public newGame(seletecedRoles: Role[], options: GameOptions): Observable<Game> {
    const id = Date.now() + '-' + Math.random();
    const game = new Game(id, seletecedRoles, options);
    this.games.set(id, game);
    return of(game);
  }

  public replayGame(game: Game): Observable<Game> {
    return this.newGame(game.selectedRoles, game.gameOptions);
  }

  public getGame(gameId: string): Observable<Game> {
    let game = this.games.get(gameId);
    // just a mocked game to avoid creating it every time
    if (!game) {
      game = new Game(gameId, [
        new Role('werewolf', ''),
        new Role('werewolf', ''),
        new Role('seer', ''),
        new Role('robber', ''),
        new Role('troublemaker', ''),
        new Role('drunk', ''),
        new Role('hunter', ''),
        new Role('insomniac', '')],
        null);
    }
    if (!game.players) {
      game.players = [
        new Player('1', 'Yo'),
        new Player('2', 'Cécé'),
        new Player('3', 'Guigui'),
        new Player('4', 'Roma'),
        new Player('5', 'Moi')
      ];
    }
    return of(game);
  }

  public listGames(): Observable<Game[]> {
    return of([]);
  }

  public listBackgroundMusics(): Observable<string[]> {
    throw new Error("Method not implemented.");
  }
}
