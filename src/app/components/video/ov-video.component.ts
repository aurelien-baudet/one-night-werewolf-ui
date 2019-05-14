import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { StreamManager } from 'openvidu-browser';

@Component({
  selector: 'ov-video',
  template: `
    <video
      #videoElement
      [attr.id]="streamManager && _streamManager.stream ? 'video-' + _streamManager.stream.streamId : 'video-undefined'"
      [muted]="mutedSound"></video>`,
  styles: [`
        video {
            -o-object-fit: cover;
            object-fit: cover;
            width: 100%;
            height: 100%;
            color: #ffffff;
            margin: 0;
            padding: 0;
            border: 0;
            font-size: 100%;
        }
    `],
})
export class OpenViduVideoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoElement') elementRef: ElementRef<HTMLVideoElement>;

  @Input() mutedSound: boolean;

  private _streamManager: StreamManager;
  private playing = false;


  ngAfterViewInit() {
    if (this._streamManager) {
      this._streamManager.addVideoElement(this.elementRef.nativeElement);
    }
  }


  @HostListener('document:keyup', ['$event'])
  @HostListener('document:click', ['$event'])
  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:dblclick', ['$event'])
  @HostListener('document:touchend', ['$event'])
  playVideos(event) {
    // ugly hack due to security restriction changes for
    // video autoplay:
    // - https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
    // - https://developers.google.com/web/updates/2018/11/web-audio-autoplay
    if(!!this.elementRef && !this.playing) {
        this.elementRef.nativeElement.play()
          .then(() => this.playing = true)
          .catch((e) => console.error('playing failed', event, e, e.message));
    }
  }

  @Input()
  set streamManager(streamManager: StreamManager) {
    if(this._streamManager === streamManager) {
        return;
    }
    this._streamManager = streamManager;
    if (!!this.elementRef && this._streamManager) {
      if (this._streamManager.stream.typeOfVideo === 'SCREEN') {
        this.elementRef.nativeElement.style.objectFit = 'contain';
        this.elementRef.nativeElement.style.background = '#878787';
      } else {
        this.elementRef.nativeElement.style.objectFit = 'cover';
      }
      this._streamManager.addVideoElement(this.elementRef.nativeElement);
    }
  }

  ngOnDestroy() {
      if(this._streamManager) {
          this._streamManager.disassociateVideo(this.elementRef.nativeElement);
      }
  }
}