import { Role } from './Role';
import { Card } from './Card';

export interface CardsSwitched {
  card1Id: string;
  card2Id: string;
}

export class CardsSwitched implements CardsSwitched {
  constructor(public card1Id: string,
              public card2Id: string) {}
}

export interface PlayerBoard {
  playerId: string;
  originalRole: Role;
  cards: Card[];
  movements: CardsSwitched[];
}

export class PlayerBoard implements PlayerBoard {
  constructor(public playerId: string,
              public originalRole: Role,
              public cards: Card[],
              public movements: CardsSwitched[]) {}
}


export enum Phase {
  SUNSET,
  AWAKE,
  SLEEPING,
  SUNRISE,
  DISCUSS,
  VOTE
}


export interface Board {
  remainingDiscussionDuration: number;
  remainingVoteDuration: number;
  currentRole: Role;
  playerBoard: PlayerBoard;
  distributed: boolean;
  started: boolean;
  ended: boolean;
  phase: Phase;
}

export class Board implements Board {
  constructor(public remainingDiscussionDuration: number,
              public remainingVoteDuration: number,
              public currentRole: Role,
              public playerBoard: PlayerBoard,
              public distributed: boolean,
              public started: boolean,
              public ended: boolean,
              public phase: Phase) {}
}
