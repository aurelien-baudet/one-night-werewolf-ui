import { GameRef } from 'src/app/domain/Game';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { PlayerRef } from 'src/app/domain/Player';
import { VoteService } from '../vote.service';
import { Vote, VoteResult } from 'src/app/domain/Vote';

@Injectable()
export class MockVoteService implements VoteService {

    public getVotes(game: GameRef): Observable<Vote[]> {
        return of([
            new Vote("1", "2"),
            new Vote("2", "1"),
            new Vote("3", "2"),
            new Vote("4", "1")
        ]);
    }

    public vote(game: GameRef, voter: PlayerRef, against: PlayerRef): Observable<Vote> {
        return of(new Vote("1", "2"));
    }

    public hasEveryoneVoted(game: GameRef): Observable<boolean> {
        return of(false);
    }

    public getWinners(game: GameRef): Observable<VoteResult> {
        throw new Error("Method not implemented.");
    }

}