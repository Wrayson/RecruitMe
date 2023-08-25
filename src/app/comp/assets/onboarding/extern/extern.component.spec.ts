import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternComponent } from './extern.component';

describe('ExternComponent', () => {
  let component: ExternComponent;
  let fixture: ComponentFixture<ExternComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExternComponent]
    });
    fixture = TestBed.createComponent(ExternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
