import { Injectable } from '@angular/core';
import { Role } from '../domain/Role';
import { Game, GameRef } from '../domain/Game';
import { Observable } from 'rxjs';

export abstract class RoleService {
  public abstract getAvailableRoles(): Observable<Role[]>;
  public abstract getOrderedPlayingRoles(game: GameRef): Observable<Role[]>;
}
