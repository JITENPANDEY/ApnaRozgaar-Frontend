import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppService } from 'src/app/services/app/app.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { UserService } from 'src/app/services/user/user.service';
import swal from 'sweetalert2';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-applied-jobs',
  templateUrl: './applied-jobs.component.html',
  styleUrls: ['./applied-jobs.component.scss']
})
export class AppliedJobsComponent implements OnInit {
  userService: UserService;
  appService: AppService;
  login:boolean;
  searchedJobTitle;
  searchedJobNotFound = false;

  noSavedJob = true;
  noAppliedJob = true;

  saveStatus = 'Save';


  currentPage: number = 1;
  tempPage: number;

  myControl = new FormControl();
  options = ['Bangalore', 'Delhi', 'Chennai', 'Mumbai', 'Bihar'];
  filteredOptions: Observable<string[]>;

  allJobs = [];
  savedJobs = [];
  appliedJobs = [];
  allJobsCopy = [];

  jobSavedStatus = {};
  jobAppliedStatus = {};
  status = {};
  isNew = {};

  subscription: Subscription;

  constructor(appService:AppService,userService:UserService,private router:Router,public loaderService: LoaderService,) {
    this.appService=appService;
    this.userService=userService
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

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );


    this.userService.fetchSavedJobs();

    this.userService.fetchAppliedJobs();

    this.userService.fetchAllJobs();

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
        for (let x in this.savedJobs) {
          if (this.allJobs[o]['jobId'] == this.savedJobs[x]['jobId']) {
            this.status[this.allJobs[o]['jobId']] = 'Saved';
          }
        }
      }

      for (let a in this.allJobs) {
        this.jobAppliedStatus[this.allJobs[a]['jobId']] = false;
        for (let x in this.appliedJobs) {
          if (this.allJobs[a]['jobId'] == this.appliedJobs[x]['jobId']) {
            this.jobAppliedStatus[this.allJobs[a]['jobId']] = true;
            this.status[this.allJobs[a]['jobId']] = 'Applied';
          }
        }
      }
      this.noSavedJob = this.savedJobs.length == 0 ? true : false;
      this.noAppliedJob = this.appliedJobs.length == 0 ? true : false;

      this.allJobsCopy = [...this.allJobs];
    });
  }

  onProfileClick(){
    this.router.navigate(['user-profile']);

  }
  onUserLogout(){
    window.localStorage.clear();
    this.appService.login = false;
    this.appService.role = '';
    this.login = false;
    this.router.navigate(['/']);

  }
  onJobPostClick(jobId,companyName) {
    this.router.navigate(['job/' + jobId + '/' + companyName]);
  }
  onPageChange(page: number) {
    this.currentPage = page;
    window.scrollTo(0, 0);
  }
  onJobSave(job, status) {
    this.userService.onMoveJobToSaved(job, status);
  }

  onRemoveJob(job) {
    swal
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4BB543',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.userService.onRemoveJobFromSaved(job);
          swal.fire({
            title: 'Deleted!',
            text: 'Your Job has been removed.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(
      (option) => option.toLowerCase().indexOf(filterValue) === 0
    );
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
}
