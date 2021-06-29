import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterUtilComponent } from './footer-util.component';

describe('FooterUtilComponent', () => {
  let component: FooterUtilComponent;
  let fixture: ComponentFixture<FooterUtilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterUtilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
