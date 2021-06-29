import { HttpClient, HttpHeaders } from '@angular/common/http';
import { identifierModuleUrl } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  // baseUrl
  baseUrl = environment.baseUrl;

  private companyDetails: {
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
    gstNo: String;
  };
  public notificationCalled=false;
  private allJobs = [];
  private allApplicants = [];
  private JobDetailById;
  private companyDetailById;

  companyDetailsUpdated = new Subject<void>();
  JobDetailsUpdated = new Subject<void>();

  http: HttpClient;
  constructor(http: HttpClient, private router: Router) {
    this.http = http;
  }

  // Sign up company api
  addCompany(company): Observable<any> {
    return this.http.post(`${this.baseUrl}` + 'company/register', company);
  }

  //login company api
  login(company): Observable<any> {
    return this.http.post(`${this.baseUrl}` + 'company/login', company);
  }

  //fetch company details
  fetchCompanyDetails() {
    let companyToken = window.localStorage['loginTokenID'];
    let newToken = 'Bearer ' + companyToken;

    var header = {
      headers: new HttpHeaders().set('Authorization', newToken),
    };
    this.http
      .get(`${this.baseUrl}` + 'company/companyDetails', header)
      .pipe(
        map(
          (response: {
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
            gstNo: String;
          }) => {
            if (response == undefined) {
              
            }
            this.companyDetails = response;
            return response;
          }
        )
      )
      .subscribe(
        (data) => {
          this.companyDetails = data;
          this.companyDetailsUpdated.next();

        },
        (error) => {
          localStorage.clear();
          this.router.navigate(['/']);
        }
      );
  }

  getCompanyDetails() {
    return this.companyDetails;
  }

  //get all jobs

  fetchAllJobs() {
    let companyToken = window.localStorage['loginTokenID'];
    let newToken = 'Bearer ' + companyToken;

    var header = {
      headers: new HttpHeaders().set('Authorization', newToken),
    };
    this.http
      .get(`${this.baseUrl}` + 'company/allJobPost', header)
      .pipe(
        map(
          (response: {
            [key: string]: {
              jobId: number;
              title: string;
              description: string;
              experience: string;
              minSalary: string;
              maxSalary: string;
              lastDate: string;
              createdate: string;
              category: string;
              location: string;
              applicant: number;
            };
          }) => {
            const dataArray: {
              jobId: number;
              title: string;
              description: string;
              experience: string;
              minSalary: string;
              maxSalary: string;
              lastDate: string;
              createdate: string;
              category: string;
              location: string;
              applicant: number;
            }[] = [];
            for (const key in response) {
              if (response.hasOwnProperty(key)) {
                dataArray.push({ ...response[key] });
              }
            }

            const recievedJobs = [];
            for (let key in dataArray) {
              let value = dataArray[key];
              const job = value;
              recievedJobs.push(job);
            }
            return recievedJobs;
          }
        )
      )
      .subscribe(
        (data) => {
          data.sort((val1, val2)=> {return new Date(val2.createdate).getTime() - new Date
            (val1.createdate).getTime()});
          this.allJobs = data;
          this.companyDetailsUpdated.next();
        },
        (error) => {
          console.log(error);
          localStorage.clear();
          this.router.navigate(['/']);
        }
      );
  }

  getAllJobs() {
    return this.allJobs;
  }

  postNewJob(newJob: any) {
    let companyToken = window.localStorage['loginTokenID'];
    let newToken = 'Bearer ' + companyToken;

    var header = {
      headers: new HttpHeaders().set('Authorization', newToken),
    };
    // post api call
    this.http
      .post(`${this.baseUrl}` + 'company/newJobPost', newJob, header)
      .subscribe(
        (reponse) => {
          this.allJobs.unshift(newJob);
          this.companyDetailsUpdated.next();
          this.router.navigate(['/']);
        },
        (error) => {
          swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
          localStorage.clear();
          this.router.navigate(['/']);
        }
      );
  }

  deleteJob(jobId) {
    let companyToken = window.localStorage['loginTokenID'];
    let newToken = 'Bearer ' + companyToken;

    var header = {
      headers: new HttpHeaders().set('Authorization', newToken),
    };
    // post api call
    this.http
      .get(
        `${this.baseUrl}` + 'company/deleteJobPost/' + jobId.toString(),
        header
      )
      .subscribe(
        (response) => {
          let i = 0;
          for (let job of this.allJobs) {
            if (job.jobId === jobId) {
              this.allJobs.splice(i, 1);
              break;
            }
            i++;
          }
          this.companyDetailsUpdated.next();
        },
        (error) => {
          // alert('Sorry!\nSome Error Occured');
          console.log(error);
        }
      );
  }

  fetchJobById(jobId) {
    let companyToken = window.localStorage['loginTokenID'];
    let newToken = 'Bearer ' + companyToken;

    var header = {
      headers: new HttpHeaders().set('Authorization', newToken),
    };
    // post api call
    this.http
      .get(
        `${this.baseUrl}` + 'company/jobDetailsbyId/' + jobId.toString(),
        header
      )
      .subscribe(
        (response) => {
          this.JobDetailById = response;
          this.JobDetailsUpdated.next();
        },
        (error) => {
          (error) => {
            localStorage.clear();
            this.router.navigate(['/']);
          };
        }
      );
  }

  getJobDetailById() {
    return this.JobDetailById;
  }

  onUpdateJobDetail(job) {
    let companyToken = window.localStorage['loginTokenID'];
    let newToken = 'Bearer ' + companyToken;

    var header = {
      headers: new HttpHeaders().set('Authorization', newToken),
    };
    // post api call
    this.http
      .post(`${this.baseUrl}` + 'company/updateJobPost', job, header)
      .subscribe(
        (reponse) => {
          swal.fire({
            title: 'Good job!',
            text: 'Job updated successfully',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
          this.router.navigate(['/']);
        },
        (error) => {
          swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
        }
      );
  }

  onUpdateCompanyDetail(company) {
    let companyToken = window.localStorage['loginTokenID'];
    let newToken = 'Bearer ' + companyToken;

    var header = {
      headers: new HttpHeaders().set('Authorization', newToken),
    };
    // post api call
    this.http
      .post(`${this.baseUrl}` + 'company/addDetails', company, header)
      .subscribe(
        (reponse) => {
          swal.fire({
            title: 'Good job!',
            text: 'Saved Details Successfully',
            icon: 'success',
          });
         this.router.navigate(['/']);
        },
        (error) => {
          swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
        }
      );
  }

  // applicant status
  fetchAllApplicants(id) {
    let companyToken = window.localStorage['loginTokenID'];
    let newToken = 'Bearer ' + companyToken;

    var header = {
      headers: new HttpHeaders().set('Authorization', newToken),
    };

    this.http
      .get(`${this.baseUrl}` + 'company/userapplied/' + id.toString(), header)
      .pipe(
        map(
          (response: {
            [key: string]: {
              id: any;
              seekerSignup: any;
              jobPost: any;
              status: string;
              job_id: number;
              applicationstatus: string;
            };
          }) => {
            const dataArray: {
              id: any;
              seekerSignup: any;
              jobPost: any;
              status: string;
              job_id: number;
              applicationstatus: string;
            }[] = [];
            for (const key in response) {
              if (response.hasOwnProperty(key)) {
                dataArray.push({ ...response[key] });
              }
            }
            const recievedJobs = [];
            for (let key in dataArray) {
              let value = dataArray[key];
              const job = value;
              recievedJobs.push(job);
            }
            return recievedJobs;
          }
        )
      )
      .subscribe(
        (data) => {
          this.allApplicants = data;
          this.companyDetailsUpdated.next();
        },
        (error) => {
          localStorage.clear();
          this.router.navigate(['/']);
        }
      );
  }

  getAllApplicants() {
    return this.allApplicants;
  }

  updateAllApplicants(applicant) {
    if (applicant.applicationstatus == 'InProcess') {
      applicant.applicationstatus = 'hired';
    } else if (applicant.applicationstatus == 'hired') {
      applicant.applicationstatus = 'reject';
    } else if (applicant.applicationstatus == 'reject') {
      applicant.applicationstatus = 'hired';
    }

    let companyToken = window.localStorage['loginTokenID'];
    let newToken = 'Bearer ' + companyToken;

    var header = {
      headers: new HttpHeaders().set('Authorization', newToken),
    };
    this.http
      .put(`${this.baseUrl}` + 'company/applicationstatus', applicant, header)
      .subscribe(
        (reponse) => {
          swal.fire({
            title: 'Update Successfully!',
            text: 'Applicant Status Updated',
            icon: 'success',
          });
          const id = applicant.seekerSignup.id;
          for (var i = 0; i < this.allApplicants.length; i++) {
            if (this.allApplicants[i].seekerSignup.id == id) {
              if (this.allApplicants[i].applicationstatus == 'InProcess') {
                this.allApplicants[i].applicationstatus = 'hired';
              } else if (this.allApplicants[i].applicationstatus == 'hired') {
                this.allApplicants[i].applicationstatus = 'reject';
              } else if (this.allApplicants[i].applicationstatus == 'reject') {
                this.allApplicants[i].applicationstatus = 'hired';
              }
            }
          }
          this.companyDetailsUpdated.next();
        },
        (error) => {

          swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
        }
      );
  }

  closeJob(jobId) {
    let companyToken = window.localStorage['loginTokenID'];
    let newToken = 'Bearer ' + companyToken;

    var header = {
      headers: new HttpHeaders().set('Authorization', newToken),
    };
    this.http
      .put(`${this.baseUrl}` + 'company/closeJobId/' + jobId.toString(), header)
      .subscribe(
        (reponse) => {
          swal.fire({
            title: 'Hiring Closed Successfully!',
            icon: 'success',
          });

          for (var i = 0; i < this.allApplicants.length; i++) {
            if (this.allApplicants[i].applicationstatus == 'InProcess') {
              this.allApplicants[i].applicationstatus = 'reject';
            }
            this.allApplicants[i].jobPost.closehirinig = 'Yes';
          }
          this.companyDetailsUpdated.next();
        },
        (error) => {
          swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
        }
      );
  }
}
