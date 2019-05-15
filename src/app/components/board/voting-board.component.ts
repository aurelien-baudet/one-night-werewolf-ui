import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Board } from 'src/app/domain/Board';
import { Player } from 'src/app/domain/Player';
import { BoardUtils, Selection } from './utils';
import { CdkDragDrop, CdkDrag, CdkDropList, transferArrayItem } from '@angular/cdk/drag-drop';
import { Vote } from 'src/app/domain/Vote';

@Component({
  selector: 'app-voting-board',
  templateUrl: './voting-board.component.html',
  styleUrls: ['./voting-board.component.scss']
})
export class VotingBoardComponent {
  @Input()
  board: Board;
  @Input()
  players: Player[];
  @Input()
  deadPlayers: Player[];
  @Input()
  votes: Vote[];
  @Output()
  voted = new EventEmitter<{voter: Player, against: Player}>();

  getNumPlayersClass() {
    return BoardUtils.getNumPlayersClass(this.players);
  }

  getPlayerClass(idx: number) {
    return BoardUtils.getPlayerClass(idx);
  }

  getPlayerIdx(player: Player) {
    return this.players.findIndex((p) => p.id === player.id);
  }

  private getPlayerFromId(id: string): Player {
    return this.players.filter((p) => p.id === id)[0];
  }


  getVotesAgainstPlayer(player: Player): Player[] {
    if (!this.votes || !this.players) {
      return [];
    }
    return this.votes
            .filter((v) => v.againstId === player.id)
            .map((v) => v.voterId)
            .map(this.getPlayerFromId.bind(this));
  }

  hasVoted(player: Player) {
    if (!this.votes) {
      return false;
    }
    const votes = this.votes
                    .filter((v) => v.voterId === player.id);
    return votes.length > 0;
  }

  hasVotedAgainst(voter: Player, against: Player) {
    return this.getVotesAgainstPlayer(against).some((v) => v.id === voter.id);
  }

  canVote(drag: CdkDrag<Player>, drop: CdkDropList<Player>) {
    const voter = drag.data;
    const against = drop.data;
    return voter.id !== against.id;
  }


  drop(event: CdkDragDrop<Player[]>, against: Player) {
    const voter = event.item.data;
    // can't vote for self
    if (voter.id === against.id) {
      return;
    }
    // if voter has already voted against the same player
    // => cancel
    if (this.hasVotedAgainst(voter, against)) {
      return;
    }
    this.vote(voter, against);
  }

  vote(voter: Player, against: Player) {
    console.log(`${voter.name} has voted against ${against.name}`);
    this.voted.emit({voter, against});
  }

  isDead(player: Player) {
    if (!this.deadPlayers) {
      return false;
    }
    return this.deadPlayers.find((p) => p.id === player.id);
  }

}
