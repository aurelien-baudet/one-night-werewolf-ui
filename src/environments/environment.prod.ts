import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';
import { RestRoleService } from 'src/app/services/remote/rest-role.service';
import { RoleService } from 'src/app/services/role.service';
import { GameService } from 'src/app/services/game.service';
import { RestGameService } from 'src/app/services/remote/rest-game.service';
import { PlayerService } from 'src/app/services/player.service';
import { StompPlayerService } from 'src/app/services/remote/stomp-player.service';

const serverHost = 'localhost';
const serverPort = '8080';
const openViduPort = '4443';

const rxStompConfig: InjectableRxStompConfig = {
  // Which server?
  brokerURL: `ws://${serverHost}:${serverPort}/ws`,

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
    console.debug(new Date(), msg);
  }
};

export const environment = {
  production: true,
  mock: false,
  backend: {
    url: `http://${serverHost}:${serverPort}`
  },
  openVidu: {
    serverUrl: `https://${serverHost}:${openViduPort}`
  },
  rxStompConfig
};
