import { Injectable, Inject } from '@angular/core';
import { RoleService } from '../role.service';
import { Role } from '../../domain/Role';
import { Game, GameRef } from '../../domain/Game';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BackendConfigToken, BackendConfig } from 'src/environments/backend-config';

@Injectable({
  providedIn: 'root'
})
export class RestRoleService implements RoleService {
  constructor(private http: HttpClient,
              @Inject(BackendConfigToken) private backendConfig: BackendConfig) {}

  public getAvailableRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.backendConfig.url}/roles`);
  }

  public getOrderedPlayingRoles(game: GameRef): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.backendConfig.url}/games/${game.id}/roles`);
  }
}
