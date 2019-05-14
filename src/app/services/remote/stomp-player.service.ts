import { Injectable } from '@angular/core';
import { Role } from 'src/app/domain/Role';
import { GameOptions, Game, GameRef } from 'src/app/domain/Game';
import { Observable, Subject } from 'rxjs';
import { PlayerService } from '../player.service';
import { Player, PlayerRef, NewPlayer } from 'src/app/domain/Player';
import { RxStompService } from '@stomp/ng2-stompjs';
import { map, mapTo, first } from 'rxjs/operators';
import { StompHelper } from './stomp-helper';

@Injectable({
  providedIn: 'root'
})
export class StompPlayerService implements PlayerService {

  constructor(private rxStompService: RxStompService,
              private stomHelper: StompHelper) { }

  public getPlayers(game: GameRef): Observable<Player[]> {
    // const obs = this.rxStompService.watch(`/topic/games/${game.id}/players`).pipe(
    //   map((m) => JSON.parse(m.body))
    // );
    // this.rxStompService.publish({
    //   destination: `/app/games/${game.id}/players`
    // });
    // return obs;
    return this.stomHelper.watchAndPublish(`games/${game.id}/players`).pipe(
      map((m) => JSON.parse(m.body))
    );
  }

  public addPlayer(game: GameRef, player: NewPlayer): Observable<Player> {
    // const obs = this.rxStompService.watch(`/topic/games/${game.id}/players/add`).pipe(
    //   map((m) => JSON.parse(m.body))
    // );
    // const subscription = obs.subscribe(() => subscription.unsubscribe());
    // this.rxStompService.publish({
    //   destination: `/app/games/${game.id}/players/add`,
    //   body: JSON.stringify(player)
    // });
    // return obs;
    return this.stomHelper.watchAndPublish(`games/${game.id}/players/add`, {
      body: JSON.stringify(player)
    }).pipe(
      first(),
      map((m) => JSON.parse(m.body))
    );
  }

  public removePlayer(game: GameRef, player: PlayerRef): Observable<void> {
    // const obs = this.rxStompService.watch(`/topic/games/${game.id}/players/${player.id}/remove`).pipe(
    //   mapTo(null)
    // );
    // const subscription = obs.subscribe(() => subscription.unsubscribe());
    // this.rxStompService.publish({
    //   destination: `/app/games/${game.id}/players/${player.id}/remove`
    // });
    // return obs;
    return this.stomHelper.watchAndPublish(`games/${game.id}/players/${player.id}/remove`).pipe(
      first(),
      mapTo(null)
    );
  }

}
