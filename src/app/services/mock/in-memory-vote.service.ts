import { GameRef } from 'src/app/domain/Game';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { PlayerRef, Player } from 'src/app/domain/Player';
import { VoteService } from '../vote.service';
import { Vote, VoteResult } from 'src/app/domain/Vote';

@Injectable()
export class InMemoryVoteService implements VoteService {
  private votes: Vote[] = [];
  private votes$: Subject<Vote[]> = new BehaviorSubject([]);

  public getVotes(game: GameRef): Observable<Vote[]> {
    return this.votes$;
  }

  public vote(game: GameRef, voter: PlayerRef, against: PlayerRef): Observable<Vote> {
    const vote = new Vote(voter.id, against.id);
    this.votes.push(vote);
    this.votes$.next(this.votes);
    return of(vote);
  }

  public hasEveryoneVoted(game: GameRef): Observable<boolean> {
    return of(this.votes.length === 5);
  }

  public getWinners(game: GameRef): Observable<VoteResult> {
    return of(new VoteResult(this.votes,
      [new Player('1', ''), new Player('5', '')],                         // deads
      [new Player('2', ''), new Player('3', ''), new Player('4', '')],    // winner
      [new Player('1', ''), new Player('5', '')]));                       // loosers
    }
  }
