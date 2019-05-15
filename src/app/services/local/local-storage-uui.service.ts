import { Injectable } from '@angular/core';
import { UuidService } from '../uuid.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class LocalStorageUuidService implements UuidService {
  public get(): Observable<string> {
    let uuid = localStorage.getItem('browser-uuid');
    if (!uuid) {
      uuid = Date.now() + '-' + Math.random();
      localStorage.setItem('browser-uuid', uuid);
    }
    return of(uuid);
  }
}
