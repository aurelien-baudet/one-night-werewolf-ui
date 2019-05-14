import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareGamePage } from './prepare-game.page';

describe('SelectRolesComponent', () => {
  let component: PrepareGamePage;
  let fixture: ComponentFixture<PrepareGamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareGamePage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareGamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
