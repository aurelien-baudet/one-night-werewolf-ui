import { GameRef } from '../domain/Game';
import { Observable } from 'rxjs';
import { PlayerRef } from '../domain/Player';
import { Vote, VoteResult } from '../domain/Vote';

export abstract class VoteService {
  public abstract getVotes(game: GameRef): Observable<Vote[]>
  public abstract vote(game: GameRef, voter: PlayerRef, against: PlayerRef): Observable<Vote>;
  public abstract hasEveryoneVoted(game: GameRef): Observable<boolean>;
  public abstract getWinners(game: GameRef): Observable<VoteResult>;
}
