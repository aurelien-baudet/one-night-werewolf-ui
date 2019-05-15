export interface Role {
  name: string;
  description: string;
  nightAction: string;
}

export class Role implements Role {
  constructor(public name: string, public description: string) {}
}
