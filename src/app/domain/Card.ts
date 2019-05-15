import { Role } from './Role';

export interface Position {
}
export class InTheMiddle implements Position {
  constructor(public place: number) {}
}
export class InFrontOfPlayer implements Position {
  constructor(public playerId: string) {}
}

export interface Card {
  id: string;
  role: Role;
  visible: boolean;
  position: Position;
}

export class Card implements Card {
  constructor(public id: string,
              public role: Role,
              public visible = false,
              public position: Position = null) {}
}
