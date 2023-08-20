import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VertragAComponent } from './vertrag-a.component';

describe('VertragAComponent', () => {
  let component: VertragAComponent;
  let fixture: ComponentFixture<VertragAComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VertragAComponent]
    });
    fixture = TestBed.createComponent(VertragAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
