import { Role } from './Role';
import { Player } from './Player';

export interface Game {
  id: string;
  selectedRoles: Role[];
  gameOptions: GameOptions;
  players: Player[];
}
export class Game implements Game {
  constructor(public id: string,
              public selectedRoles: Role[],
              public gameOptions: GameOptions) {}
}

export interface GameOptions {
  pauseDuration: number;
  discussionDuration: number;
  guidedMode: boolean;
  backgroundMusic: string;
  backgroundMusicVolume: number;
}
export class DefaultGameOptions implements GameOptions {
  pauseDuration = 2000;
  discussionDuration = 300000;
  guidedMode = false;
  backgroundMusic = 'fantasy';
  backgroundMusicVolume = 0.2;
}

export type GameRef = Pick<Game, 'id'>;
