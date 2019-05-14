import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NightProgressComponent } from './night-progress.component';

describe('NightProgressComponent', () => {
  let component: NightProgressComponent;
  let fixture: ComponentFixture<NightProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NightProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NightProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
