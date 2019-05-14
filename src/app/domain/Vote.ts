import { Player } from './Player';

export interface Vote {
    voterId: string;
    againstId: string;
}

export class Vote implements Vote {
    constructor(public voterId: string,
                public againstId: string) {}
}

export interface VoteResult {
    votes: Vote[];
    deads: Player[];
    winners: Player[];
    loosers: Player[];
}

export class VoteResult implements VoteResult {
    constructor(public votes: Vote[],
                public deads: Player[],
                public winners: Player[],
                public loosers: Player[]) {}
}