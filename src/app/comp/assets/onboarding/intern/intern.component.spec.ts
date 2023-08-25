import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternComponent } from './intern.component';

describe('WorkComponent', () => {
  let component: InternComponent;
  let fixture: ComponentFixture<InternComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternComponent]
    });
    fixture = TestBed.createComponent(InternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
