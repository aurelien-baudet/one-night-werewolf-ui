import { Injectable } from '@angular/core';
import { RoleService } from '../role.service';
import { Role } from '../../domain/Role';
import { Game, GameRef } from '../../domain/Game';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockRoleService implements RoleService {

  public getAvailableRoles(): Observable<Role[]> {
    return of([
      new Role("villager", ""),
      new Role("villager", ""),
      new Role("villager", ""),
      new Role("werewolf", ""),
      new Role("werewolf", ""),
      new Role("seer", ""),
      new Role("robber", ""),
      new Role("troublemaker", ""),
      new Role("tanner", ""),
      new Role("drunk", ""),
      new Role("hunter", ""),
      new Role("mason", ""),
      new Role("mason", ""),
      new Role("insomniac", ""),
      new Role("minion", ""),
      new Role("doppleganger", "")
    ])
  }

  public getOrderedPlayingRoles(game: GameRef): Observable<Role[]> {
    return of([
      //new Role("doppleganger", ""),
      new Role("werewolf", ""),
      //new Role("minion", ""),
      //new Role("mason", ""),
      new Role("seer", ""),
      new Role("robber", ""),
      new Role("troublemaker", ""),
      new Role("drunk", ""),
      new Role("insomniac", ""),
      //new Role("doppleganger", "")
    ])
  }
}
