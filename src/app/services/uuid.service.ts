import { Observable } from 'rxjs';

export abstract class UuidService {
  public abstract get(): Observable<string>;
}
