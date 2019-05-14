import { Injectable, Inject } from '@angular/core';
import { GameService } from '../game.service';
import { Role } from 'src/app/domain/Role';
import { GameOptions, Game } from 'src/app/domain/Game';
import { Observable, from, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BackendConfig, BackendConfigToken } from 'src/environments/backend-config';
import { flatMap, concatMap, map, delay, takeLast, take, first } from 'rxjs/operators';
import { PlayerService } from '../player.service';
import { VideoService } from '../video.service';
import { UuidService } from '../uuid.service';
import { PlayerVideoStream } from 'src/app/domain/Video';
import { PlayerRef } from 'src/app/domain/Player';


@Injectable({
  providedIn: 'root'
})
export class RestGameService implements GameService {
  constructor(private http: HttpClient,
              @Inject(BackendConfigToken) private backendConfig: BackendConfig) {}

  public newGame(selectedRoles: Role[], options: GameOptions): Observable<Game> {
    return this.http.post<Game>(`${this.backendConfig.url}/games`, {selectedRoles, options});
  }

  public replayGame(game: Game): Observable<Game> {
    return this.http.patch<Game>(`${this.backendConfig.url}/games/${game.id}`, {});
  }

  public getGame(gameId: string): Observable<Game> {
    return this.http.get<Game>(`${this.backendConfig.url}/games/${gameId}`);
  }

  public listGames(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.backendConfig.url}/games`);
  }

  // private async copyGame(game: Game): Promise<Game> {
  //   const currentStreamsMetadatas = await this.videoService.getStreams(game).pipe(first()).toPromise();
  //   const newGame = await this.newGame(game.selectedRoles, game.options).pipe(first()).toPromise();
  //   const uuid = await this.uuidService.get().pipe(first()).toPromise();
  //   for(const player of game.players) {
  //     const newPlayer = await this.playerService.addPlayer(newGame, player).pipe(first()).toPromise();
  //     if(this.wasPlayerPlayingOnThisDevice(currentStreamsMetadatas, uuid, player)) {
  //       await this.videoService.streamVideo(newGame, uuid, newPlayer).pipe(first()).toPromise();
  //     }
  //   }
  //   return this.getGame(newGame.id).pipe(first()).toPromise();
  // }

  // private wasPlayerPlayingOnThisDevice(currentStreamsMetadatas: PlayerVideoStream[], uuid: string, player: PlayerRef): boolean {
  //   return currentStreamsMetadatas.some(m => m.player.id === player.id && m.group === uuid);
  // }
}
