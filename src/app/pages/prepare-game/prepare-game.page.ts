import { Component, OnInit } from '@angular/core';
import { RoleService } from 'src/app/services/role.service';
import { Role } from 'src/app/domain/Role';
import { DefaultGameOptions } from 'src/app/domain/Game';
import { GameService } from 'src/app/services/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prepare-game-page',
  templateUrl: './prepare-game.page.html',
  styleUrls: ['./prepare-game.page.scss']
})
export class PrepareGamePage implements OnInit {
  private selectedRoles: Role[] = [];
  availableRoles: Role[];

  constructor(private roleService: RoleService,
              private gamePreparationService: GameService,
              private router: Router) { }

  ngOnInit() {
    this.roleService.getAvailableRoles()
      .subscribe((roles) => this.availableRoles = roles);
  }

  updateSelectedRoles(roles: Role[]) {
    this.selectedRoles = roles;
  }

  createGame() {
    // TODO: handle options
    this.gamePreparationService.newGame(this.selectedRoles, new DefaultGameOptions())
      .subscribe((game) => this.router.navigate(['games', game.id, 'join']));
  }

}
