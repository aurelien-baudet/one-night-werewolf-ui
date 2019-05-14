import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrepareGamePage } from './pages/prepare-game/prepare-game.page';
import { JoinPage } from './pages/join/join.page';
import { GamePage } from './pages/game/game.page';
import { GameList } from './pages/game-list/game-list.component';

const routes: Routes = [{
  path: 'games',
  component: GameList,
  pathMatch: 'full'
}, {
  path: 'games/new',
  component: PrepareGamePage,
  pathMatch: 'full'
}, {
  path: 'games/:id/join',
  component: JoinPage,
  pathMatch: 'full'
}, {
  path: 'games/:id/play',
  component: GamePage,
  pathMatch: 'full'
}, {
  path: '',
  pathMatch: 'full',
  redirectTo: 'games'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
