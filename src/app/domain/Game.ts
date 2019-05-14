import { Role } from './Role';
import { Player } from './Player';

export interface Game {
    id: string;
    selectedRoles: Role[];
    options: GameOptions;
    players: Player[];
}
export class Game implements Game {
    constructor(public id: string,
                public selectedRoles: Role[],
                public options: GameOptions) {}
}

export interface GameOptions {
    pauseDuration: number;
    discussionDuration: number;
    guidedMode: boolean;
}
export class DefaultGameOptions implements GameOptions {
    pauseDuration = 2000;
    discussionDuration = 300000;
    guidedMode = false;
}

export type GameRef = Pick<Game, 'id'>;
