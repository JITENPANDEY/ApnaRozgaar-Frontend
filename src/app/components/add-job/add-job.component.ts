import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from 'src/app/services/company/company/company.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app/app.service';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert2';
export interface Skills {
  skill: string;
}
@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.scss'],
})
export class AddJobComponent implements OnInit {
  login: boolean;
  addJobForm: FormGroup;
  companyService: CompanyService;
  appService: AppService;
  selectedCategory:string;
  constructor(
    private formBuilder: FormBuilder,
    appService: AppService,
    companyService: CompanyService,
    public loaderService: LoaderService,
    private router: Router,
    public translate: TranslateService 
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

    this.addJobForm = this.formBuilder.group({
      title: ['', Validators.required],
      experience: [''],
      minSalary: ['', [Validators.required]],
      maxSalary: ['', [Validators.required]],
      description: [''],
      lastDate: ['', Validators.required],
      category: ['', Validators.required],
      location: ['', [Validators.required]],
    });
  }
  // reset(): void {
  //   this.addJobForm.reset();
  //   this.addJobForm.clearValidators;
  // }
  onCompanyLogout() {
    window.localStorage.clear();
    this.appService.login = false;
    this.appService.role = '';
    this.login = false;
    this.router.navigate(['/']);
  }
  onSave(): void {
    swal
      .fire({
        title: 'Do you want to save this job?',
        showCancelButton: true,
        confirmButtonColor: '#4BB543',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Save',
      })
      .then((result) => {
        if (result.isConfirmed) {
          let newJob = {
            title: this.addJobForm.value.title,
            experience: Number(this.addJobForm.value.experience),
            minSalary: Number(this.addJobForm.value.minSalary),
            maxSalary: Number(this.addJobForm.value.maxSalary),
            description: this.addJobForm.value.description,
            lastDate: new Date(this.addJobForm.value.lastDate),
            category: this.selectedCategory,
            location: this.addJobForm.value.location,
          };
          this.companyService.postNewJob(newJob);
          swal.fire('Added', 'Job Added Successfully', 'success');
        }
      });
  }
}
