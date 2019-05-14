// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';
import { RoleService } from 'src/app/services/role.service';
import { MockRoleService } from 'src/app/services/mock/mock-role.service';
import { GameService } from 'src/app/services/game.service';
import { PlayerService } from 'src/app/services/player.service';
import { MockGameService } from 'src/app/services/mock/mock-game.service';
import { RestGameService } from 'src/app/services/remote/rest-game.service';
import { MockPlayerService } from 'src/app/services/mock/mock-player.service';
import { RestRoleService } from 'src/app/services/remote/rest-role.service';
import { StompPlayerService } from 'src/app/services/remote/stomp-player.service';

const exposed = true;
const secured = true;

let serverHost = 'localhost';
let serverPort = '8080';
let openViduPort = '4443';
let serverPath = '';
let openviduPath = '';

if(exposed) {
  serverHost = '192.168.0.22';
}

if(exposed && secured) {
  serverHost = 'werewolf.localdomain.com';
  serverPort = '443';
  openViduPort = '443';
  serverPath = '/backend';
  openviduPath = '/openvidu';
}

const rxStompConfig: InjectableRxStompConfig = {
  // Which server?
  brokerURL: `ws${secured ? 's' : ''}://${serverHost}:${serverPort}/ws`,

  // Headers
  // Typical keys: login, passcode, host
  connectHeaders: {
    login: 'guest',
    passcode: 'guest'
  },

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeatIncoming: 0, // Typical value 0 - disabled
  heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 500 (500 milli seconds)
  reconnectDelay: 200,

  // Will log diagnostics on console
  // It can be quite verbose, not recommended in production
  // Skip this key to stop logging to console
  debug: (msg: string): void => {
    // console.debug(new Date(), msg);
  }
};

export const environment = {
  production: false,
  mock: false,
  backend: {
    url: `http${secured ? 's' : ''}://${serverHost}:${serverPort}${serverPath}`
  },
  openVidu: {
    serverUrl: `https://${serverHost}:${openViduPort}${openviduPath}`
  },
  rxStompConfig
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
