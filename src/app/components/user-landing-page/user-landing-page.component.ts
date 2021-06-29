import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppService } from 'src/app/services/app/app.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { UserService } from 'src/app/services/user/user.service';
import { NotifierService } from 'angular-notifier';

import swal from 'sweetalert2';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';

@Component({
  selector: 'app-user-landing-page',
  templateUrl: './user-landing-page.component.html',
  styleUrls: ['./user-landing-page.component.scss'],
})
export class UserLandingPageComponent implements OnInit {
  panelOpenState = false;

  currentPage: number = 1;
  tempPage: number;

  searchedJobTitle;
  searchedJobNotFound = false;

  login: boolean;
  noSavedJob = true;
  noAppliedJob = true;

  saveStatus = 'Save';

  userService: UserService;
  appService: AppService;

  allJobs = [];
  savedJobs = [];
  appliedJobs = [];
  allJobsCopy = [];

  jobSavedStatus = {};
  jobAppliedStatus = {};
  status = {};

  saved = {};
  applied = {};
  isNew = {};

  subscription: Subscription;

  private readonly notifier: NotifierService;
  spinnerService: SpinnerService;

  // myControl = new FormControl();
  // options = ['Bangalore', 'Delhi', 'Chennai', 'Mumbai', 'Bihar'];
  // filteredOptions: Observable<string[]>;

  filterCategory = '';
  filterLocation = '';

  constructor(
    private router: Router,
    userService: UserService,
    public loaderService: LoaderService,
    appService: AppService,
    public translate: TranslateService,
    notifierService: NotifierService,
    spinnerService: SpinnerService
  ) {
    this.userService = userService;
    this.appService = appService;
    this.notifier = notifierService;
    this.spinnerService = spinnerService;
  }

  ngOnInit(): void {
    this.login = this.appService.login;
    if (this.login == false) {
      this.router.navigate(['/']);
      return;
    }

    this.userService.fetchSavedJobs();

    this.userService.fetchAppliedJobs();

    this.userService.fetchAllJobs();

    this.userService.fetchUser();

    this.subscription = this.userService.jobUpdate.subscribe(() => {
      this.savedJobs = this.userService.getSavedJobs();
      this.appliedJobs = this.userService.getAppliedJobs();
      this.allJobs = this.userService.getAllJobs();

      for (let o in this.allJobs) {

        this.isNew[this.allJobs[o]['jobId']] = false;
        let date1 = new Date(this.allJobs[o]['createdate']).getTime();
        let now = new Date().getTime();
        let yesterday = new Date(now - (1 * 24 * 60 * 60 * 1000)).getTime();

        if(date1 > yesterday)
          this.isNew[this.allJobs[o]['jobId']] = true;


        this.status[this.allJobs[o]['jobId']] = 'Save';
        this.saved[this.allJobs[o]['jobId']] = 'Save';

        for (let x in this.savedJobs) {
          if (this.allJobs[o]['jobId'] == this.savedJobs[x]['jobId']) {
            this.status[this.allJobs[o]['jobId']] = 'Saved';
            this.saved[this.allJobs[o]['jobId']] = 'Saved';
          }
        }
      }

      for (let a in this.allJobs) {
        this.applied[this.allJobs[a]['jobId']] = 'Apply';
        for (let x in this.appliedJobs) {
          if (this.allJobs[a]['jobId'] == this.appliedJobs[x]['jobId']) {
            this.status[this.allJobs[a]['jobId']] = 'Applied';
            this.applied[this.allJobs[a]['jobId']] = 'Applied';
          }
        }
      }
      this.noSavedJob = this.savedJobs.length == 0 ? true : false;
      this.noAppliedJob = this.appliedJobs.length == 0 ? true : false;

      this.allJobsCopy = [...this.allJobs];

      if(this.userService.apifetched == true)
        this.showNotification();

    });

  }

  showNotification(){
    if(this.userService.notifcationCalled==false){
      this.userService.notifcationCalled=true;

      if(!this.userService.verified){
        this.notifier.show({
          type: 'info',
          message: 'Please fill your details and wait for 24 hours for verification!'
        });
      }else{
        this.notifier.show({
          type: 'success',
          message: `Your account is verified!`
        });
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

  onJobSave(job, status) {
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

  onRemoveJob(job) {
    this.userService.onRemoveJobFromSaved(job);
  }

  onJobPostClick(jobId,companyName) {
    this.router.navigate(['job/' + jobId + '/' + companyName]);
  }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.options.filter(
  //     (option) => option.toLowerCase().indexOf(filterValue) === 0
  //   );
  // }

  onPageChange(page: number) {
    this.currentPage = page;
    window.scrollTo(0, 0);
  }

  search() {
    if (this.searchedJobTitle == '') {
      this.searchedJobNotFound = false;
      this.ngOnInit();
    } else {
      this.allJobs = this.allJobsCopy.filter((res) =>
        res.title
          .toLocaleLowerCase()
          .includes(this.searchedJobTitle.trim().toLocaleLowerCase())
      );

      if (this.allJobs.length == 0) {
        this.searchedJobNotFound = true;
      } else {
        this.searchedJobNotFound = false;
        this.tempPage = this.currentPage;
        this.currentPage = 1;
      }
    }
  }

  onFilter() {
    let category = this.filterCategory;
    let location = this.filterLocation;


    if (category == '' && location == '') {
      this.ngOnInit();
    }
    if (category == '' || category == null) {
      category = 'all';
    }
    if (location == '' || location == null) {
      location = 'all';
    }

    this.userService.onFilter(category, location).subscribe((response) => {

      this.allJobs = response;

      if (this.allJobs.length == 0) {
        this.searchedJobNotFound = true;
      } else {
        this.searchedJobNotFound = false;
        this.tempPage = this.currentPage;
        this.currentPage = 1;
      }
    });
  }

  onReset() {
    this.searchedJobNotFound = false;
    this.allJobs = [...this.allJobsCopy];
  }

  onCategoryChange(category) {
    this.filterCategory = category;
  }
}
