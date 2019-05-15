import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { RouterState, RouterStateSnapshot, ActivatedRoute, Router } from '@angular/router';
import { Player, NewPlayer, PlayerRef } from 'src/app/domain/Player';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/services/game.service';
import { Game } from 'src/app/domain/Game';
import { VideoService } from 'src/app/services/video.service';
import { BoardUtils } from 'src/app/components/board/utils';
import { UuidService } from 'src/app/services/uuid.service';
import { PlayerVideoStream } from 'src/app/domain/Video';
import { flatMap, first } from 'rxjs/operators';


interface UiPlayer {
}
class JoinedPlayer implements UiPlayer {
  constructor(public playerInfo: Player) {}
}
class WaitingPlayer implements UiPlayer {
}

@Component({
  selector: 'app-join',
  templateUrl: './join.page.html',
  styleUrls: ['./join.page.scss']
})
export class JoinPage implements OnInit, OnDestroy {
  private players: Player[] = [];
  private uiPlayers: UiPlayer[] = [];
  private gameId: string;
  private playersSubsciption: Subscription;
  private uuid: string;
  streams: PlayerVideoStream[] = [];
  newPlayer: NewPlayer = {name: ''};
  numPlayers = 0;
  readyTimer: any;


  constructor(private gameService: GameService,
              private joinService: PlayerService,
              private uuidService: UuidService,
              private videoService: VideoService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.gameService.getGame(this.gameId)
      .subscribe(this.updateNumPlayers.bind(this));
    this.playersSubsciption = this.joinService.getPlayers({id: this.gameId})
      .subscribe(this.updatePlayers.bind(this));
    this.readyTimer = setInterval(this.startIfReady.bind(this), 500);
    this.uuidService.get()
      .subscribe((uuid) => this.uuid = uuid);
    this.videoService.getStreams({id: this.gameId})
      .subscribe(this.updateStreams.bind(this));
  }

  private updateNumPlayers(game: Game) {
    this.numPlayers = game.selectedRoles.length - 3;
    this.updatePlayers(this.players);
  }

  private updatePlayers(players: Player[]) {
    this.players = players;
    let i = 0;
    // add players that are ready
    for ( ; i < Math.min(this.players.length, this.numPlayers) ; i++) {
      this.uiPlayers[i] = new JoinedPlayer(this.players[i]);
    }
    // add empty players to show waiting
    for ( ; i < this.numPlayers ; i++) {
      this.uiPlayers[i] = new WaitingPlayer();
    }
  }

  isPlayerReady(uiPlayer: UiPlayer) {
    return uiPlayer instanceof JoinedPlayer;
  }

  addPlayer(player: NewPlayer) {
    // TODO: ensure unique name in same game
    // TODO: listen to answer (handle error cases)
    // TODO: message to indicate that no more player is allowed
    console.log('addPlayer', player);
    this.joinService.addPlayer({id: this.gameId}, player)
      .subscribe(this.streamOwnCamera.bind(this));
  }

  removePlayer(player: Player) {
    this.joinService.removePlayer({id: this.gameId}, player)
      .subscribe();
  }

  isEverybodyReady() {
    return this.players.length === this.numPlayers;
  }

  startIfReady(): void {
    if (this.numPlayers > 0 && this.isEverybodyReady()) {
      clearInterval(this.readyTimer);
      this.router.navigate(['games', this.gameId, 'play']);
    }
  }

  private updateStreams(streams: PlayerVideoStream[]) {
    console.log('updateStreams', streams);
    this.streams = streams;
  }

  private streamOwnCamera(player: Player) {
    console.log('streamOwnCamera', player);
    this.videoService.streamVideo({id: this.gameId}, this.uuid, player)
      .subscribe();
  }

  // private stopCamera(player: Player) {
  //   this.videoService.stopVideo({id: this.gameId}, this.uuid)
  //     .subscribe();
  // }

  getNumPlayersClass() {
    return BoardUtils.getNumPlayersClass(new Array(this.numPlayers));
  }

  getPlayerClass(idx: number) {
    return BoardUtils.getPlayerClass(idx);
  }

  ngOnDestroy(): void {
    clearInterval(this.readyTimer);
    this.playersSubsciption.unsubscribe();
    this.stopVideo();
  }

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    this.stopVideo();
  }

  private async stopVideo() {
    return this.videoService.stopVideo({id: this.gameId}, this.uuid)
            .pipe(first())
            .toPromise();
  }
}
