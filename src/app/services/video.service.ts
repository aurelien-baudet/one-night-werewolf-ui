import { Observable } from 'rxjs';
import { Game, GameRef } from '../domain/Game';
import { Player, PlayerRef } from '../domain/Player';
import { PlayerVideoStream } from '../domain/Video';

export abstract class VideoService {
    // public abstract connect(game: GameRef, uuid: string, player: PlayerRef): Observable<PlayerVideoStream>;
    public abstract streamVideo(game: GameRef, uuid: string, player: PlayerRef): Observable<void>;
    public abstract stopVideo(game: GameRef, uuid: string): Observable<void>;
    public abstract getStreams(game: GameRef): Observable<PlayerVideoStream[]>;
    // public abstract disconnect(game: GameRef, uuid: string, player: PlayerRef): Observable<void>;
}