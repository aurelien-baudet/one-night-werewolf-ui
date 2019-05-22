import { Component, OnInit } from '@angular/core';
import { RoleService } from 'src/app/services/role.service';
import { Role } from 'src/app/domain/Role';
import { DefaultGameOptions, GameOptions } from 'src/app/domain/Game';
import { GameService } from 'src/app/services/game.service';
import { Router } from '@angular/router';

class FormattedGameOptions {
  pauseDurationSeconds: number;
  pauseDurationSecondsMin = 1;
  pauseDurationSecondsMax = 15;
  discussionDurationMinutes: number;
  discussionDurationMinutesMin = 1;
  discussionDurationMinutesMax = 10;
  backgroundMusic: string;
  backgroundMusicVolumePercent: number;

  constructor(options: GameOptions) {
    this.pauseDurationSeconds = options.pauseDuration / 1000;
    this.discussionDurationMinutes = options.discussionDuration / 1000 / 60;
    this.backgroundMusic = options.backgroundMusic;
    this.backgroundMusicVolumePercent = options.backgroundMusicVolume * 100;
  }

  toOptions(): GameOptions {
    return {
      pauseDuration: this.pauseDurationSeconds * 1000,
      discussionDuration: this.discussionDurationMinutes * 1000 * 60,
      backgroundMusic: this.backgroundMusic,
      backgroundMusicVolume: this.backgroundMusicVolumePercent / 100,
      guidedMode: false
    };
  }
}

@Component({
  selector: 'app-prepare-game-page',
  templateUrl: './prepare-game.page.html',
  styleUrls: ['./prepare-game.page.scss']
})
export class PrepareGamePage implements OnInit {
  private selectedRoles: Role[] = [];
  availableRoles: Role[];
  options = new FormattedGameOptions(new DefaultGameOptions());
  backgroundMusics: string[];

  constructor(private roleService: RoleService,
              private gamePreparationService: GameService,
              private router: Router) { }

  ngOnInit() {
    this.roleService.getAvailableRoles()
      .subscribe((roles) => this.availableRoles = roles);
    this.gamePreparationService.listBackgroundMusics()
      .subscribe((musics) => this.backgroundMusics = musics);
  }

  updateSelectedRoles(roles: Role[]) {
    this.selectedRoles = roles;
  }

  createGame() {
    this.gamePreparationService.newGame(this.selectedRoles, this.options.toOptions())
      .subscribe((game) => this.router.navigate(['games', game.id, 'join']));
  }

  inc(field: string, inc: number) {
    this.options[field] = Math.min(this.options[field+'Max'], Math.max(this.options[field+'Min'], this.options[field] + inc));
  }
}
