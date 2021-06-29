import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyJobApplicantsComponent } from './company-job-applicants.component';

describe('CompanyJobApplicantsComponent', () => {
  let component: CompanyJobApplicantsComponent;
  let fixture: ComponentFixture<CompanyJobApplicantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyJobApplicantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyJobApplicantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
