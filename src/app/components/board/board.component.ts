import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Player } from 'src/app/domain/Player';
import { Board } from 'src/app/domain/Board';
import { InTheMiddle, InFrontOfPlayer, Card } from 'src/app/domain/Card';
import { BoardUtils, Selection } from './utils';
import { Role } from 'src/app/domain/Role';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnChanges {
  @Input()
  board: Board;
  @Input()
  players: Player[];
  @Input()
  deadPlayers: Player[];
  @Input()
  winners: Player[];
  @Input()
  loosers: Player[];
  @Input()
  enableDistributionEffect: boolean;
  @Input()
  canPlay: boolean;
  @Input()
  canViewCard: boolean;

  @Output()
  playerSelected = new EventEmitter<Player>();
  @Output()
  returnCard = new EventEmitter<{player: Player, card: Card}>();
  @Output()
  switchCards = new EventEmitter<{player: Player, sourceCard: Card, destinationCard: Card}>();

  playerSelection: Selection<Player>;
  private overCardId: string;
  private cardMovement: {sourceCard: Card, destinationCard: Card};
  private draggingCardId: string;
  distributed = false;
  distributing = false;

  ngOnInit() {
    this.playerSelection = new Selection<Player>((p) => p.id, this.playerSelected);
    this.distribute();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.distribute();
  }

  private distribute() {
    if (!this.board) {
      return;
    }
    if (!this.enableDistributionEffect) {
      this.distributed = true;
    }
    // distribution effect
    if (!this.distributed && !this.distributing && this.board.distributed && !this.board.ended) {
      this.distributing = true;
      setTimeout(() => this.distributed = true, 0);
      setTimeout(() => this.distributing = false, 500);
    }
  }

  getCards() {
    if (!this.board || !this.board.distributed) {
      return [];
    }
    return this.board.playerBoard.cards;
  }

  getNumPlayersClass() {
    return BoardUtils.getNumPlayersClass(this.players);
  }

  getPlayerClass(idx: number) {
    return BoardUtils.getPlayerClass(idx);
  }

  getCardClass(card: Card) {
    let moving = {};
    // if there is a movement => take the class of the other card
    if (this.cardMovement && this.cardMovement.sourceCard.id === card.id) {
      card = this.cardMovement.destinationCard;
      moving = {moving: true};
    } else if (this.cardMovement && this.cardMovement.destinationCard.id === card.id) {
      card = this.cardMovement.sourceCard;
      moving = {moving: true};
    }

    // set the CSS classes to place cards on the board
    if ('place' in card.position) {
      return {
        'center-card': true,
        ['place' + (card.position as InTheMiddle).place]: true,
        ...moving
      };
    }
    if ('playerId' in card.position) {
      return {
        'player-card': true,
        ['player' + this.getPlayerIndex((card.position as InFrontOfPlayer).playerId)]: true,
        ...moving
      };
    }
    return {};
  }

  private getPlayerIndex(id: string) {
    return this.players.map((p) => p.id).indexOf(id);
  }

  toggleViewCard(card: Card) {
    if (!(this.playerSelection.someSelection() && (this.canViewCard || this.canPlay))) {
      return;
    }
    this.returnCard.emit({player: this.playerSelection.getSelection(), card});
  }

  drag(event: DragEvent, card: Card) {
    this.cardMovement = null;
    if (!this.isDragDropEnabled()) {
      return;
    }
    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.setData('id', card.id);
    this.draggingCardId = card.id;
  }

  dragover(event: DragEvent, card: Card) {
    event.preventDefault();
    if (!this.isDragDropEnabled()) {
      return;
    }
    this.overCardId = card.id;
  }

  private isDragDropEnabled() {
    return this.canPlay && this.playerSelection.someSelection();
  }

  isOver(card: Card) {
    if (!this.isDragDropEnabled()) {
      return false;
    }
    return this.overCardId === card.id;
  }

  isDragging(card: Card) {
    if (!this.isDragDropEnabled()) {
      return false;
    }
    return this.draggingCardId === card.id;
  }

  drop(event: DragEvent, destinationCard: Card) {
    event.preventDefault();
    this.overCardId = null;
    this.draggingCardId = null;
    if (!this.isDragDropEnabled()) {
      return;
    }
    const sourceCard = this.board.playerBoard.cards
      .find((c) => c.id === event.dataTransfer.getData('id'));
    if (sourceCard.id === destinationCard.id) {
      return;
    }
    // visually move the cards
    this.cardMovement = {sourceCard, destinationCard};
    setTimeout(() => {
      this.switchCards.emit({player: this.playerSelection.getSelection(), sourceCard, destinationCard});
      this.cardMovement = null;
    }, 250);
  }


  isDead(player: Player) {
    if (!this.deadPlayers) {
      return false;
    }
    return this.deadPlayers.find((p) => p.id === player.id);
  }

  isWinner(player: Player) {
    if (!this.winners) {
      return false;
    }
    return this.winners.find((p) => p.id === player.id);
  }

  isLooser(player: Player) {
    if (!this.loosers) {
      return false;
    }
    return this.loosers.find((p) => p.id === player.id);
  }
}
