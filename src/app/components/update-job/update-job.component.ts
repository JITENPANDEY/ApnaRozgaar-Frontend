import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app/app.service';
import { CompanyService } from 'src/app/services/company/company/company.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

export interface Skills {
  skill: string;
}
@Component({
  selector: 'app-update-job',
  templateUrl: './update-job.component.html',
  styleUrls: ['./update-job.component.scss'],
})
export class UpdateJobComponent implements OnInit {
  Job: {
    jobId: number;
    title: string;
    experience: number;
    minSalary: number;
    maxSalary: number;
    description: string;
    category: string;
    lastDate: string;
    location: string;
    applicant: number;
  };

  updateJobForm: FormGroup;
  companyService: CompanyService;
  appService: AppService;
  subscription: Subscription;
  login: boolean;
  selectedCategory: string;

  constructor(
    private formBuilder: FormBuilder,
    companyService: CompanyService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    appService: AppService
  ) {
    this.companyService = companyService;
    this.appService = appService;
  }

  ngOnInit(): void {
    let token = window.localStorage['loginTokenID'];
    let role = window.localStorage['role'];
    if (token == undefined) {
      this.router.navigate(['/']);
      return;
    } else {
      this.login = true;
      this.appService.login = true;
    }

    this.updateJobForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      experience: ['', [Validators.required]],
      minSalary: ['', [Validators.required]],
      maxSalary: ['', [Validators.required]],
      description: [''],
      category: ['', [Validators.required]],
      lastDate: ['', [Validators.required]],
      location: ['', [Validators.required]],
      applicant: ['', [Validators.required]],
    });

    let jobId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
    this.companyService.fetchJobById(jobId);

    this.subscription = this.companyService.JobDetailsUpdated.subscribe(() => {
      this.Job = this.companyService.getJobDetailById();
      this.selectedCategory = this.Job.category;
      this.updateJobForm.patchValue({
        title: this.Job.title,
        experience: this.Job.experience,
        minSalary: this.Job.minSalary,
        maxSalary: this.Job.maxSalary,
        description: this.Job.description,
        category: this.selectedCategory,
        lastDate: new Date(this.Job.lastDate),
        location: this.Job.location,
        applicant: this.Job.applicant,
      });
    });
  }
  onCompanyLogout() {
    console.log('logged out');
    window.localStorage.clear();
    this.appService.login = false;
    this.appService.role = '';
    this.login = false;
    this.router.navigate(['/']);
  }

  onUpdateJob() {
    this.Job.title = this.updateJobForm.value.title;
    this.Job.experience = this.updateJobForm.value.experience;
    this.Job.minSalary = this.updateJobForm.value.minSalary;
    this.Job.maxSalary = this.updateJobForm.value.maxSalary;
    this.Job.description = this.updateJobForm.value.description;
    this.Job.category = this.updateJobForm.value.category;
    this.Job.lastDate = this.updateJobForm.value.lastDate;
    this.Job.location = this.updateJobForm.value.location;
    this.Job.applicant = this.updateJobForm.value.applicant;

    this.companyService.onUpdateJobDetail(this.Job);
  }
}
