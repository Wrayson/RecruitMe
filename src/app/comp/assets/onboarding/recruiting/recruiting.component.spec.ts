import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitingComponent } from './recruiting.component';

describe('RecruitingComponent', () => {
  let component: RecruitingComponent;
  let fixture: ComponentFixture<RecruitingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecruitingComponent]
    });
    fixture = TestBed.createComponent(RecruitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});