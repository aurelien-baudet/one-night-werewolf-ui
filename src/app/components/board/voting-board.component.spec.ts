import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingBoardComponent } from './voting-board.component';

describe('VotingBoardComponent', () => {
  let component: VotingBoardComponent;
  let fixture: ComponentFixture<VotingBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotingBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
