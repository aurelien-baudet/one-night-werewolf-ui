import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OpenviduSessionModule, OpenVidu } from 'openvidu-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InjectableRxStompConfig, RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';
import { environment } from 'src/environments/environment';
import { CardComponent } from './components/card/card.component';
import { PlayerComponent } from './components/player/player.component';
import { TimerComponent } from './components/timer/timer.component';
import { NightProgressComponent } from './components/night-progress/night-progress.component';
import { JoinPage } from './pages/join/join.page';
import { GamePage } from './pages/game/game.page';
import { RolesSelectionComponent } from './components/roles-selection/roles-selection.component';
import { RoleService } from './services/role.service';
import { MockRoleService } from './services/mock/mock-role.service';
import { RestRoleService } from './services/remote/rest-role.service';
import { PrepareGamePage } from './pages/prepare-game/prepare-game.page';
import { GameService } from './services/game.service';
import { MockGameService as MockGameService } from './services/mock/mock-game.service';
import { RestGameService } from './services/remote/rest-game.service';
import { PlayerService } from './services/player.service';
import { MockPlayerService } from './services/mock/mock-player.service';
import { StompPlayerService } from './services/remote/stomp-player.service';
import { BoardComponent } from './components/board/board.component';
import { BackendConfigToken, OpenViduConfigToken } from 'src/environments/backend-config';
import { BoardService } from './services/board.service';
import { MockBoardService } from './services/mock/mock-board.service';
import { StompBoardService } from './services/remote/stomp-board.service';
import { VotingBoardComponent } from './components/board/voting-board.component';
import { VoteService } from './services/vote.service';
import { StompVoteService } from './services/remote/stomp-vote.service';
import { MockVoteService } from './services/mock/mock-vote.service';
import { InMemoryVoteService } from './services/mock/in-memory-vote.service';
import { GameList } from './pages/game-list/game-list.component';
import { StompVideoService } from './services/remote/stomp-video.service';
import { VideoService } from './services/video.service';
import { LocalStorageUuidService } from './services/local/local-storage-uui.service';
import { UuidService } from './services/uuid.service';
import { OpenViduVideoComponent } from './components/video/ov-video.component';
import { VideoBoardComponent } from './components/board/video-board.component';
// import { NoSleep } from 'nosleep.js';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    PlayerComponent,
    TimerComponent,
    NightProgressComponent,
    JoinPage,
    PrepareGamePage,
    GamePage,
    RolesSelectionComponent,
    BoardComponent,
    VotingBoardComponent,
    GameList,
    OpenViduVideoComponent,
    VideoBoardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DragDropModule,
    OpenviduSessionModule
  ],
  providers: [
    {
      provide: BackendConfigToken,
      useValue: environment.backend
    },
    {
      provide: OpenViduConfigToken,
      useValue: environment.openVidu
    },
    {
      provide: InjectableRxStompConfig,
      useValue: environment.rxStompConfig
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig]
    },
    {
      provide: RoleService,
      useClass: environment.mock ? MockRoleService : RestRoleService
    },
    {
      provide: GameService,
      useClass: environment.mock ? MockGameService : RestGameService
    },
    {
      provide: PlayerService,
      useClass: environment.mock ? MockPlayerService : StompPlayerService
    },
    {
      provide: BoardService,
      useClass: environment.mock ? MockBoardService : StompBoardService
    },
    {
      provide: VoteService,
      useClass: environment.mock ? InMemoryVoteService : StompVoteService
    },
    {
      provide: UuidService,
      useClass: LocalStorageUuidService
    },
    {
      provide: VideoService,
      useClass: StompVideoService
    },
    OpenVidu,
    // NoSleep
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
