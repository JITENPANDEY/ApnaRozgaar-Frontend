import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app/app.service';
import { UserService } from 'src/app/services/user/user.service';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-job-page',
  templateUrl: './job-page.component.html',
  styleUrls: ['./job-page.component.scss'],
})
export class JobPageComponent implements OnInit {
  userService: UserService;
  appService: AppService;

  login: boolean;

  curCompany: {
    moto: String;
    companyDetailId: number;
    companyName: String;
    email: String;
    description: String;
    photo: String;
    website: String;
    address: String;
    city: String;
    state: String;
    country: String;
    pinCode: String;
    verified: String;
  }


  allJobs = [];
  savedJobs = [];
  appliedJobs = [];
  companyJobs = [];

  jobSavedStatus = {};
  jobAppliedStatus = {};
  status = {};

  saved = {};
  applied = {};
  isNew = {};

  private readonly notifier: NotifierService;

  subscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    appService: AppService,
    userService: UserService,
    private router: Router,
    notifierService: NotifierService
  ) {
    this.userService = userService;
    this.appService = appService;
    this.notifier = notifierService;
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

    let jobId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
    let companyName = this.activatedRoute.snapshot.paramMap.get('companyName');


    this.userService.fetchSavedJobs();
    this.userService.fetchAppliedJobs();
    this.userService.fetchAllJobs();

    this.curCompany = {
      moto: '',
      companyDetailId: 0,
      companyName: '',
      email: '',
      description: '',
      photo: '',
      website: '',
      address: '',
      city: '',
      state: '',
      country: '',
      pinCode: '',
      verified: ''
    }

    this.userService.fetchCompanyDetails(jobId, companyName);
    this.subscription = this.userService.companyDetailsUpdated.subscribe(() => {
      this.curCompany = this.userService.getCompanyDetails();
      this.userService.fetchCompanyJobs(this.curCompany.companyDetailId);
    });

    this.subscription = this.userService.jobUpdate.subscribe(() => {
      this.savedJobs = this.userService.getSavedJobs();
      this.appliedJobs = this.userService.getAppliedJobs();
      this.allJobs = this.userService.getAllJobs();

      this.companyJobs = this.userService.getCompanyJobs();

      for (let o in this.companyJobs) {

        this.isNew[this.companyJobs[o]['jobId']] = false;
        let date1 = new Date(this.companyJobs[o]['createdate']).getTime();
        let now = new Date().getTime();
        let yesterday = new Date(now - (1 * 24 * 60 * 60 * 1000)).getTime();

        if(date1 > yesterday)
          this.isNew[this.companyJobs[o]['jobId']] = true;


        this.status[this.companyJobs[o]['jobId']] = 'Save';
        this.saved[this.companyJobs[o]['jobId']] = 'Save';

        for (let x in this.savedJobs) {
          if (this.companyJobs[o]['jobId'] == this.savedJobs[x]['jobId']) {
            this.status[this.companyJobs[o]['jobId']] = 'Saved';
            this.saved[this.companyJobs[o]['jobId']] = 'Saved';
          }
        }
      }

      for (let a in this.companyJobs) {
        this.applied[this.companyJobs[a]['jobId']] = 'Apply';
        for (let x in this.appliedJobs) {
          if (this.companyJobs[a]['jobId'] == this.appliedJobs[x]['jobId']) {
            this.status[this.companyJobs[a]['jobId']] = 'Applied';
            this.applied[this.companyJobs[a]['jobId']] = 'Applied';
          }
        }
      }

    });
  }

  onJobSave(job, status) {
    console.log(this.userService.verified);
    if(status == "Applied" && !this.userService.verified) {
      this.notifier.notify('warning', 'You cannot apply without verification.');
    }
    else {
      this.userService.onMoveJobToSaved(job, status);
      for (let j in this.savedJobs) {
        if (job.jobId == this.savedJobs[j]['jobId'])
          this.userService.onRemoveJobFromSaved(job);
      }
    }
  }

  onUserLogout() {
    window.localStorage.clear();
    this.appService.login = false;
    this.appService.role = '';
    this.login = false;
    this.router.navigate(['/']);
  }
}
