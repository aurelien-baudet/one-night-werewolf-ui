import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameList } from './game-list.component';

describe('GameListComponent', () => {
  let component: GameList;
  let fixture: ComponentFixture<GameList>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameList ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
