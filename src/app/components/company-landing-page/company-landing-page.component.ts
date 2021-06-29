import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app/app.service';
import { MatDialog } from '@angular/material/dialog';
import { CompanyService } from 'src/app/services/company/company/company.service';
import { Subscription } from 'rxjs';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-company-landing-page',
  templateUrl: './company-landing-page.component.html',
  styleUrls: ['./company-landing-page.component.scss'],
})
export class CompanyLandingPageComponent implements OnInit {
  //pagination
  currentPage = 1;

  appService: AppService;
  spinnerService: SpinnerService;
  companyService: CompanyService;
  login: boolean;

  category = new FormControl('all',[]);
  selectedCategory = this.category.value;
  allJobforCategory: any[];
  activeJobs=0;
  allJobsLength = 0;

  companyDetails: {
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
    verified: Boolean;
    adharNumber:String;
    adharCardImg:String;
  };


  allJobs: any[];
  allSearchedJobs: any[];
  company;

  subscription: Subscription;

  private readonly notifier: NotifierService;
  constructor(
    private router: Router,
    appService: AppService,
    spinnerService: SpinnerService,
    public dialog: MatDialog,
    companyService: CompanyService,
    public translate: TranslateService,
    notifierService: NotifierService
  ) {
    this.appService = appService;
    this.companyService = companyService;
    this.spinnerService = spinnerService;
    this.notifier = notifierService;
  }

  ngOnInit(): void {
    this.login = this.appService.login;
    if (this.login == false) {
      this.router.navigate(['/']);
      return;
    }

    this.companyDetails= {
      moto : '',
      companyDetailId : 0,
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
      verified:false,
      adharNumber:'',
      adharCardImg:''
    };
    this.companyService.fetchCompanyDetails();
    this.companyService.fetchAllJobs();

    this.subscription = this.companyService.companyDetailsUpdated.subscribe(
      () => {
        this.companyDetails = this.companyService.getCompanyDetails();
        
        this.company = this.companyDetails;
        let jobs = this.companyService.getAllJobs();
        this.allJobs = jobs;
        this.allSearchedJobs = [...this.allJobs];
        this.noSavedJob = this.allJobs.length == 0 ? true : false;
        this.allJobforCategory = jobs;
        this.activeJobs=0;
        this.findActiveJobs();
        this.showNotification();
        this.allJobsLength= this.allJobs.length;
        console.log(this.allJobs);
        
      }
    );
  }


  showNotification(){
    if(this.companyDetails && this.companyService.notificationCalled==false){
      this.companyService.notificationCalled=true;
      if(!this.companyDetails['verified']){
        this.notifier.show({
          type: 'info',
          message: 'Please wait Our Team will get in touch with you for verification!'
        });
        this.notifier.show({
          type: 'info',
          message: 'Please fill your details to start your Verification Process!'
        });
      }else{
        this.notifier.show({
          type: 'success',
          message: `Welcome ${this.companyDetails.companyName}`
        });
      }
    }
  }



  findActiveJobs(){
    for(let job of this.allJobs){
      if(job['closehirinig']=="No")
        this.activeJobs++;
    }
  }

  onCompanyLogout() {
    window.localStorage.clear();
    this.appService.login = false;
    this.appService.role = '';
    this.login = false;
    this.router.navigate(['/']);
  }

  onUpdate(jobId) {
    this.router.navigate(['/company/job/update/' + jobId]);
  }
  onDeleteJob(jobId) {
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
          this.companyService.deleteJob(jobId);
          swal.fire('Deleted!', 'Your job has been deleted.', 'success');
        }
      });
  }

  //search
  searchJobTitle;
  searchedJobNotFound = false;
  noSavedJob = true;
  search() {
    if (this.searchJobTitle == '') {
      this.searchedJobNotFound = false;
      this.ngOnInit();
    } else {
      this.allJobforCategory = this.allSearchedJobs.filter((result) =>
        result.title
          .toLocaleLowerCase()
          .includes(this.searchJobTitle.trim().toLocaleLowerCase())
      );

      if(this.allJobforCategory.length == 0) {
        this.searchedJobNotFound = true;
      }else{
        this.searchedJobNotFound = false;
      }
    }
  }

  //filter
  onFilter(event){
    let category = event.value;
    this.allJobforCategory=[];
    if (category == 'all'){
      this.allJobforCategory=this.allJobs;
      if(this.allJobforCategory.length == 0) {
        this.searchedJobNotFound = true;
      }else{
        this.searchedJobNotFound = false;
      }
    }else{
      for(let job of this.allJobs){
        if(job['category'].toLocaleLowerCase()==category.toLocaleLowerCase()){
          this.allJobforCategory.push(job);
        }
      }

      if(this.allJobforCategory.length == 0) {
        this.searchedJobNotFound = true;
      }else{
        this.searchedJobNotFound = false;
      }
    }

  }
}
