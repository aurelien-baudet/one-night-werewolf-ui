import { IPublishParams, IMessage } from '@stomp/stompjs';
import { Injectable } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Subject, Observable } from 'rxjs';
import { debug } from '../utils';

@Injectable({
    providedIn: 'root'
})
export class StompHelper {
    constructor(private rxStompService: RxStompService) {}

    watchAndPublish(topic: string, publish?: Partial<IPublishParams>): Observable<IMessage> {
        // console.debug(`watchAndPublish /topic/${topic}`);
        const obs = this.rxStompService.watch(`/topic/${topic}`)
            // .pipe(debug(`watchAndPublish:response /topic/${topic}`));
        const once = obs.subscribe(() => {
            // console.debug(`watchAndPublish:unsubscribe /topic/${topic}`);
            once.unsubscribe();
        });
        // console.debug(`watchAndPublish:publish /topic/${topic}`, publish);
        this.rxStompService.publish({
            destination: `/app/${topic}`,
            ...publish
        });
        // console.debug(`watchAndPublish:published /topic/${topic}`, publish);
        return obs;
    }

    publishWithReceipt(topic: string, publish?: Partial<IPublishParams>): Observable<any> {
        const obs = new Subject<any>();
        const receiptId = '' + (Date.now() + Math.random());
        this.rxStompService.watchForReceipt(receiptId, (f) => {
            obs.next();
        })
        this.rxStompService.publish({
            ...publish,
            destination: `/app/${topic}`,
            headers: {receipt: receiptId}
        });
        return obs;
    }
}