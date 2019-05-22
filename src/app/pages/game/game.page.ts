import { Component, OnInit, ContentChild, ViewChild, OnDestroy, HostListener, Renderer2 } from '@angular/core';
import { Role } from 'src/app/domain/Role';
import { RoleService } from 'src/app/services/role.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { map, filter, flatMap, first } from 'rxjs/operators';
import { BoardService } from 'src/app/services/board.service';
import { Board, Phase } from 'src/app/domain/Board';
import { Game } from 'src/app/domain/Game';
import { Player, PlayerRef } from 'src/app/domain/Player';
import { Card } from 'src/app/domain/Card';
import { ViewCards, SwitchCards, HideCards } from 'src/app/domain/Action';
import { Vote, VoteResult } from 'src/app/domain/Vote';
import { VoteService } from 'src/app/services/vote.service';
import { Subscription } from 'rxjs';
import { VideoService } from 'src/app/services/video.service';
import { PlayerVideoStream } from 'src/app/domain/Video';
import { UuidService } from 'src/app/services/uuid.service';
import { Duration } from 'luxon';
// import { NoSleep } from 'nosleep.js';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss']
})
export class GamePage implements OnInit, OnDestroy {
  private game: Game;
  private currentRole: Role;
  private board: Board;
  private currentPlayer: PlayerRef;
  private showDeadsOnVotingBoard = false;
  private subscriptions: Subscription[];
  private timers: any[];
  private sounds: HTMLAudioElement;
  private music: HTMLAudioElement = new Audio();
  private uuid: string;
  showWinners = false;
  players: Player[];
  playingRoles: Role[];
  currentVotes: Vote[];
  voteResult: VoteResult;
  streams: PlayerVideoStream[] = [];

  constructor(private gameService: GameService,
              private roleService: RoleService,
              private boardService: BoardService,
              private voteService: VoteService,
              private uuidService: UuidService,
              private videoService: VideoService,
              private route: ActivatedRoute,
              private router: Router,
              private renderer: Renderer2/*,
              private nosleep: NoSleep*/) { }

  async ngOnInit() {
    this.renderer.addClass(document.body, 'game-page');
    const gameId = this.route.snapshot.paramMap.get('id');
    this.game = await this.gameService.getGame(gameId).toPromise();
    this.players = this.game.players;
    this.playingRoles = await this.roleService.getOrderedPlayingRoles(this.game).toPromise();
    this.currentPlayer = {id: ''};
    this.subscriptions = [
      this.boardService.getBoard(this.game, this.currentPlayer)
        .subscribe(this.updateBoard.bind(this)),
      this.voteService.getVotes(this.game)
        .subscribe(this.updateVotes.bind(this)),
      this.uuidService.get()
        .subscribe((uuid) => this.uuid = uuid),
      this.videoService.getStreams({id: gameId})
        .subscribe(this.updateStreams.bind(this)),
      this.boardService.gameRestarted({id: gameId})
        .subscribe(this.newGame.bind(this)),
    ];
    // this.nosleep.enable();
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'game-page');
    this.cleanAndStopVideo();
  }

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    this.cleanAndStopVideo();
  }

  private async cleanAndStopVideo() {
    this.clean();
    return this.videoService.stopVideo(this.game, this.uuid)
            .pipe(first())
            .toPromise();
  }

  private unsubscribe() {
    if (this.subscriptions) {
      this.subscriptions.forEach((s) => s.unsubscribe());
    }
  }

  private clean() {
    // TODO: stop video
    // TODO: close browser => stopCamera
    // this.nosleep.disable();
    if (this.timers) {
      this.timers.forEach((t) => clearTimeout(t));
    }
    if (this.sounds) {
      this.sounds.pause();
    }
    this.stopMusic();
  }

  private async reset() {
    this.clean();
    this.unsubscribe();
    this.game = null;
    this.currentRole = null;
    this.board = null;
    this.currentPlayer = {id: ''};
    this.showDeadsOnVotingBoard = false;
    this.showWinners = false;
    this.players = null;
    this.playingRoles = null;
    this.currentVotes = null;
    this.voteResult = null;
  }

  distribute() {
    this.subscriptions.push(
      this.boardService.distribute(this.game)
        .subscribe()
    );
  }

  start() {
    this.subscriptions.push(
      this.boardService.startGame(this.game)
        .subscribe()
    );
  }

  restart() {
    this.clean();
    // board will be updated
    this.subscriptions.push(
      this.gameService.replayGame(this.game)
        .subscribe()
    );
  }

  private async newGame() {
    await this.reset();
    await this.ngOnInit();
  }

  private updateBoard(board: Board) {
    console.log('updateBoard', this.game.id, board);
    this.board = board;
    this.currentRole = board.currentRole;
    if (this.board.phase === Phase.SUNSET) {
      this.everyoneCloseEyes();
    } else if (this.board.phase === Phase.AWAKE) {
      this.wakeUp(this.currentRole);
    } else if (this.board.phase === Phase.SLEEPING) {
      this.closeEyes(this.currentRole);
    } else if (this.board.phase === Phase.SUNRISE) {
      this.everyoneWakeUp();
    } else if (this.board.phase === Phase.DISCUSS) {
      this.informRemainingTime();
    } else if (this.board.phase === Phase.VOTE && !this.isGameEnded()) {
      this.prepareToVote();
    }
    // play background music
    if ((this.board.phase === Phase.SUNSET || this.isNight()) && !this.isGameEnded()) {
      this.playMusic();
    } else {
      this.stopMusic();
    }
  }

  private everyoneCloseEyes() {
    this.playSound(`fr_male_everyone_close`);
  }

  private wakeUp(role: Role) {
    this.playSound(`fr_male_${role.name}_wake`);
  }

  private closeEyes(role: Role) {
    this.playSound(`fr_male_${role.name}_close`);
  }

  private everyoneWakeUp() {
    this.playSound(`fr_male_everyone_wake`);
  }

  private informRemainingTime() {
    if (this.board.remainingDiscussionDuration === Duration.fromObject({minute: 1}).as('milliseconds')) {
      this.playSound('fr_male_timer_1min');
    }
    if (this.board.remainingDiscussionDuration === Duration.fromObject({seconds: 30}).as('milliseconds')) {
      this.playSound('fr_male_timer_30sec');
    }
  }

  private prepareToVote() {
    if (this.board.remainingVoteDuration > Duration.fromObject({seconds: 3}).as('milliseconds')) {
      this.playSound(`fr_male_everyone_timeisup`);
    }
    if (this.board.remainingVoteDuration === Duration.fromObject({seconds: 3}).as('milliseconds')) {
      this.playSound(`fr_male_321vote`);
    }
  }


  private playSound(sound: string) {
    if (!this.sounds) {
      this.sounds = new Audio();
    }
    if (this.sounds.src.indexOf(`assets/sounds/${sound}.mp3`) !== -1) {
      return;
    }
    this.sounds.src = `assets/sounds/${sound}.mp3`;
    this.sounds.load();
    this.sounds.play();
  }


  private playMusic() {
    const source = `assets/sounds/background_${this.game.gameOptions.backgroundMusic}.mp3`;
    if (this.music.src.indexOf(source) !== -1) {
      return;
    }
    this.music.loop = true;
    this.music.volume = this.game.gameOptions.backgroundMusicVolume;
    this.music.src = source;
    this.music.load();
    this.music.play();
  }

  private stopMusic() {
    this.music.pause();
  }

  isGameNotStarted() {
    return this.board
            && this.board.distributed
            && !this.board.started;
  }

  isNight() {
    return this.board
            && this.board.distributed
            && this.board.started
            && this.board.phase !== Phase.DISCUSS
            && this.board.phase !== Phase.VOTE;
  }

  isGameEnded() {
    return this.board && this.board.ended;
  }

  displayDistributeButton() {
    return !this.board || !this.board.distributed && !this.board.started && !this.board.phase;
  }

  displayStartButton() {
    return this.board && this.board.distributed && this.board && !this.board.started;
  }

  displayRestartButton() {
    return this.isGameEnded();
  }

  displayBoard() {
    return !this.board || this.board.phase !== Phase.VOTE || this.displayGameResult();
  }

  displayGameResult() {
    return this.voteResult && (!this.showDeadsOnVotingBoard || this.showWinners);
  }

  displayNightProgress() {
    return this.isNight();
  }

  displayDiscussionTimer() {
    return this.board && this.board.remainingDiscussionDuration && this.board.phase === Phase.DISCUSS;
  }

  displayVotingBoard() {
    return this.board && this.board.phase === Phase.VOTE && !this.displayGameResult();
  }

  displayVoteTimer() {
    return this.displayVotingBoard()
          && this.board.remainingVoteDuration <= Duration.fromObject({seconds: 3}).as('milliseconds')
          && this.board.remainingVoteDuration > 0;

  }

  displayVoteMessage() {
    return this.displayVotingBoard() && this.board.remainingVoteDuration === 0;
  }

  viewCard({player, card}: {player: Player, card: Card}) {
    this.currentPlayer.id = player.id;
    const action = card.visible ? new HideCards([card.id]) : new ViewCards([card.id]);
    this.boardService.execute(this.game, this.currentPlayer, action);
  }

  switchCards({player, sourceCard, destinationCard}: {player: Player, sourceCard: Card, destinationCard: Card}) {
    this.currentPlayer.id = player.id;
    this.boardService.execute(this.game, this.currentPlayer, new SwitchCards(sourceCard.id, destinationCard.id));
  }

  vote({voter, against}: {voter: Player, against: Player}) {
    this.voteService.vote(this.game, voter, against);
  }

  private updateVotes(votes: Vote[]) {
    console.log('votes updated', votes);
    this.currentVotes = votes;
    // once everyone has voted
    // then retrieve the deads and the winners
    this.subscriptions.push(
      this.voteService.hasEveryoneVoted(this.game)
        .pipe(
          filter((everyoneHasVoted) => everyoneHasVoted),
          flatMap(() => this.voteService.getWinners(this.game))
        )
        .subscribe(this.showResult.bind(this))
    );
  }

  private showResult(result) {
    this.showDeadsOnVotingBoard = true;
    this.voteResult = result;
    // show deads for 2s
    // then show the board with the cards visible for 2s
    // then show who wins and who looses
    this.timers = [
      setTimeout(() => this.showDeadsOnVotingBoard = false, 2000),
      setTimeout(() => this.showWinners = true, 4000)
    ];
  }

  private updateStreams(streams: PlayerVideoStream[]) {
    console.log('updateStreams', streams);
    this.streams = streams;
  }
}
