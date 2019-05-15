export interface Player {
  id: string;
  name: string;
}

export class Player implements Player {
  constructor(public id: string, public name: string) {}
}

export type PlayerRef = Pick<Player, 'id'>;
export type NewPlayer = Pick<Player, 'name'>;
