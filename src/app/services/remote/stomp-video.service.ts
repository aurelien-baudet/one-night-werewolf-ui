import { VideoService } from '../video.service';
import { Game, GameRef } from 'src/app/domain/Game';
import { Observable, from, BehaviorSubject, ReplaySubject, of, forkJoin, interval, zip, Subject,  } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { OpenVidu, StreamManager, Session, StreamEvent, Subscriber, Publisher, ConnectionEvent, SignalEvent, Connection } from 'openvidu-browser';
import { HttpClient } from '@angular/common/http';
import { BackendConfig, BackendConfigToken } from 'src/environments/backend-config';
import { map, flatMap, catchError, concatMap, mapTo, filter, concatAll, concat, mergeAll, skipWhile, take, first, takeWhile, switchMap,  } from 'rxjs/operators';
import { PlayerVideoStream } from 'src/app/domain/Video';
import { Player, PlayerRef } from 'src/app/domain/Player';
import { RxStompService } from '@stomp/ng2-stompjs';
import { StompHelper } from './stomp-helper';
import { UuidService } from '../uuid.service';
import { debug } from '../utils';


interface SessionMetadata {
  groupName: string;
  token: {value: string};
}

interface PlayerMetadata {
  player: PlayerRef;
  groupName: string;
  token: {value: string};
}

@Injectable()
export class StompVideoService implements VideoService {
  private session: Session;
  private sessionMetadata: SessionMetadata;
  private publisher: StreamManager; // Local
  private subscribers: StreamManager[] = []; // Remotes
  private streams: PlayerVideoStream[] = [];
  private streams$ = new Subject<PlayerVideoStream[]>();
  private connections: Connection[] = [];

  constructor(private openVidu: OpenVidu,
              private rxStompService: RxStompService,
              private stomHelper: StompHelper,
              private uuidService: UuidService) {
  }

  public streamVideo(game: GameRef, uuid: string, player: PlayerRef): Observable<void> {
    // this.cleanIfDifferentGame(game);
    this.prepareOpenViduSession(game);
    return this.stomHelper.watchAndPublish(`games/${game.id}/streams/add/${uuid}/${player.id}`).pipe(
      first(),
      map((m) => JSON.parse(m.body)),
      flatMap(() => from(this.publishVideoStream())),
      flatMap(() => from(this.updateVideoStreams(game))),
    );
  }

  public getStreams(game: GameRef): Observable<PlayerVideoStream[]> {
    // this.cleanIfDifferentGame(game);
    this.handleOpenViduSessionAndStreams(game);
    return this.streams$;
  }

  public stopVideo(game: GameRef, uuid: string): Observable<void> {
    this.clean();
    return this.stomHelper.watchAndPublish(`games/${game.id}/streams/disconnect/${uuid}`).pipe(
      first(),
      map((m) => JSON.parse(m.body))
    );
  }

  private clean() {
    if (this.session) {
      this.session.disconnect();
    }

    // Empty all properties...
    this.subscribers = [];
    this.streams = [];
    delete this.publisher;
    delete this.session;
    delete this.sessionMetadata;
  }

  private cleanIfDifferentGame(game: GameRef) {
    if (this.session && this.session.sessionId !== game.id) {
      this.clean();
    }
  }

  private async handleOpenViduSessionAndStreams(game: GameRef) {
    this.prepareOpenViduSession(game);
    await this.connectVideoAndUpdateStreams(game);
    await this.autoStreamVideo(game);
  }

  private prepareOpenViduSession(game: GameRef) {
    if (this.session) {
      return;
    }
    this.session = this.openVidu.initSession();
    // On every new Stream received...
    this.session.on('connectionCreated', (event: ConnectionEvent) => {
      this.connections.push(event.connection);
    });
    this.session.on('connectionDestroyed', (event: ConnectionEvent) => {
      const idx = this.connections.indexOf(event.connection);
      if (idx !== -1) {
        this.connections.splice(idx, 1);
      }
    });
    this.session.on('signal:updateStreams', () => {
      this.updateVideoStreams(game);
    });
    this.session.on('streamCreated', (event: StreamEvent) => {
      // Subscribe to the Stream to receive it. Second parameter is undefined
      // so OpenVidu doesn't create an HTML video by its own
      const subscriber: Subscriber = this.session.subscribe(event.stream, undefined);
      this.subscribers.push(subscriber);
      this.updateVideoStreams(game);
    });
    // On every Stream destroyed...
    this.session.on('streamDestroyed', (event: StreamEvent) => {
      // Remove the stream from 'subscribers' array
      this.deleteSubscriber(event.stream.streamManager);
      this.updateVideoStreams(game);
    });
  }


  private async connectVideoAndUpdateStreams(game: GameRef) {
    const uuid = await this.uuidService.get().toPromise();
    await this.connectOpenViduSession(game, uuid);
    await this.updateVideoStreams(game);
  }

  private async connectOpenViduSession(game: GameRef, uuid: string): Promise<void> {
    if (this.session && this.session.connection && this.sessionMetadata) {
      return;
    }
    const resp = await this.stomHelper.watchAndPublish(`games/${game.id}/streams/connect/${uuid}`)
      .pipe(take(1))
      .toPromise();
    const meta = JSON.parse(resp.body);
    this.sessionMetadata = meta;
    await this.session.connect(meta.token.value, { clientData: meta });
  }

  private async getPlayersMetadata(game: GameRef): Promise<PlayerMetadata[]> {
    const resp = await this.stomHelper.watchAndPublish(`games/${game.id}/streams`)
      .pipe(take(1))
      .toPromise();
    return JSON.parse(resp.body);
  }


  private async publishVideoStream(): Promise<void> {
    if (this.publisher) {
      // send a message to all participants
      // to indicate that the current device
      // has already published his camera
      // and that other players should update
      // the number of streams
      await this.session.signal({
          type: 'updateStreams',
          to: this.connections
      });
      return;
    }
    const publisher: Publisher = this.openVidu.initPublisher(undefined, {
      audioSource: undefined, // The source of audio. If undefined default microphone
      videoSource: undefined, // The source of video. If undefined default webcam
      publishAudio: true,     // Whether you want to start publishing with your audio unmuted or not
      publishVideo: true,     // Whether you want to start publishing with your video enabled or not
      resolution: '640x480',  // The resolution of your video
      frameRate: 30,          // The frame rate of your video
      insertMode: 'APPEND',   // How the video is inserted in the target element 'video-container'
      mirror: false           // Whether to mirror your local video or not
    });

    // Publish your stream
    this.publisher = publisher;
    // TODO: wait for publish response to handle error. Resolve never triggered ?
    this.session.publish(publisher);
  }

  private async updateVideoStreams(game: GameRef): Promise<void> {
    const metas = await this.getPlayersMetadata(game);
    await this.associateAndTriggerUpdatedStreams(game, metas);
  }

  private async associateAndTriggerUpdatedStreams(game: GameRef, metas: PlayerMetadata[]) {
    this.streams = await this.associateStreamsToPlayers(metas);
    this.streams$.next(this.streams);
  }

  private associateStreamsToPlayers(metas: PlayerMetadata[]): PlayerVideoStream[] {
    return metas.map(m => new PlayerVideoStream(m.player, m.token.value, this.getStreamForPlayer(m), m.groupName));
  }

  private getStreamForPlayer(meta: PlayerMetadata): StreamManager {
    return [this.publisher, ...this.subscribers]
      .filter(s => s && this.getStreamData(s))
      .find(s => this.getStreamData(s).groupName === meta.groupName);
  }


  private getStreamData(streamManager: StreamManager): SessionMetadata {
    return JSON.parse(streamManager.stream.connection.data.split('%')[0]).clientData;
  }

  private deleteSubscriber(streamManager: StreamManager): void {
    const index = this.subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }

  private async autoStreamVideo(game: GameRef) {
    const uuid = await this.uuidService.get().toPromise();
    const metas = await this.getPlayersMetadata(game);
    // if there already is a metadata for the same group
    // => publish stream if not plublish
    if (!this.publisher && metas.find(m => m.groupName === uuid)) {
      await this.publishVideoStream();
      await this.updateVideoStreams(game);
    }
  }
}
