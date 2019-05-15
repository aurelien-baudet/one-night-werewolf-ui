import { GameRef } from 'src/app/domain/Game';
import { Observable } from 'rxjs';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Injectable } from '@angular/core';
import { PlayerRef } from 'src/app/domain/Player';
import { StompHelper } from './stomp-helper';
import { VoteService } from '../vote.service';
import { Vote, VoteResult } from 'src/app/domain/Vote';
import { map, first } from 'rxjs/operators';

@Injectable()
export class StompVoteService implements VoteService {
  constructor(private rxStompService: RxStompService,
              private stomHelper: StompHelper) {}

  public getVotes(game: GameRef): Observable<Vote[]> {
    return this.stomHelper.watchAndPublish(`games/${game.id}/votes/list`).pipe(
      map((m) => JSON.parse(m.body)),
      map((raw: any[]) => raw.map(this.mapVote))
    );
  }

  public vote(game: GameRef, voter: PlayerRef, against: PlayerRef): Observable<Vote> {
    return this.stomHelper.watchAndPublish(`games/${game.id}/votes/vote`, {
      body: JSON.stringify(new Vote(voter.id, against.id))
    }).pipe(
      first(),
      map((m) => JSON.parse(m.body)),
      map(this.mapVote)
    );
  }

  public hasEveryoneVoted(game: GameRef): Observable<boolean> {
    return this.stomHelper.watchAndPublish(`games/${game.id}/votes/has-everyone-voted`).pipe(
      first(),
      map((m) => JSON.parse(m.body)),
      map((raw) => !!raw)
    );
  }

  public getWinners(game: GameRef): Observable<VoteResult> {
    return this.stomHelper.watchAndPublish(`games/${game.id}/votes/result`).pipe(
      first(),
      map((m) => JSON.parse(m.body))
    );
  }

  private mapVote(raw: any): Vote {
    return new Vote(raw.voterId, raw.againstId);
  }
}
