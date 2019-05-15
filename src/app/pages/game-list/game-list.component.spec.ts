import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameListPage } from './game-list.component';

describe('GameListComponent', () => {
  let component: GameListPage;
  let fixture: ComponentFixture<GameListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameListPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
