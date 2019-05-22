import { Player } from 'src/app/domain/Player';
import { EventEmitter } from '@angular/core';

export class BoardUtils {
  static getNumPlayersClass(players: Player[]) {
    if (!players) {
      return {};
    }
    return {['numPlayers' + players.length]: true};
  }

  static getPlayerClass(idx: number) {
    return {['player' + idx]: true};
  }
}

export class Selection<T> {
  constructor(private identity: (t: T) => any,
              private event?: EventEmitter<T>,
              private cb?: (T) => void) {}

  private selected: T;

  toggleSelection(selected: T) {
    if (this.isSelected(selected)) {
      this.selected = null;
    } else {
      this.selected = selected;
    }
    if (this.cb) {
      this.cb(this.selected);
    }
    if (this.event) {
      this.event.emit(this.selected);
    }
  }

  isSelected(selected: T): boolean {
    return this.selected && this.identity(this.selected) === this.identity(selected);
  }

  someSelection(): boolean {
    return !!this.selected;
  }

  getSelection(): T {
    return this.selected;
  }
}
