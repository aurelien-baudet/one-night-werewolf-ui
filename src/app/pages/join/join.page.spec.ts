import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinPage } from './join.page';

describe('JoinComponent', () => {
  let component: JoinPage;
  let fixture: ComponentFixture<JoinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
