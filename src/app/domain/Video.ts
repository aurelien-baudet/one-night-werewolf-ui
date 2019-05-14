import { StreamManager } from 'openvidu-browser';
import { Player, PlayerRef } from './Player';

export interface PlayerVideoStream {
    player: PlayerRef;
    token: string;
    streamManager: StreamManager;
    group: string;
}

export class PlayerVideoStream implements PlayerVideoStream {
    constructor(public player: PlayerRef,
                public token: string,
                public streamManager: StreamManager,
                public group: string) {}
}