import { InjectionToken } from '@angular/core';

export interface BackendConfig {
  url: string;
}

export interface OpenViduConfig {
  serverUrl: string;
}

export const BackendConfigToken = new InjectionToken<BackendConfig>('backendConfig');

export const OpenViduConfigToken = new InjectionToken<OpenViduConfig>('openViduConfig');
