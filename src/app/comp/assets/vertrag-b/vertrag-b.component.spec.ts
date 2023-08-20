import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VertragBComponent } from './vertrag-b.component';

describe('VertragBComponent', () => {
  let component: VertragBComponent;
  let fixture: ComponentFixture<VertragBComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VertragBComponent]
    });
    fixture = TestBed.createComponent(VertragBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
