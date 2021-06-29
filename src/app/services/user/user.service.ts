import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders,
  HttpClient,
} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AppService } from '../app/app.service';
import swal from 'sweetalert2';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  allJobs = [];
  private savedJobs = [];
  appliedJobs = [];
  companyJobs = [];

  verified = false;
  apifetched = false;

  getHeader() {
    const headers = new HttpHeaders();
    const token = window.localStorage['loginTokenID'];
    const newToken = 'Bearer ' + token;

    const header = {
      headers: new HttpHeaders().set('Authorization', newToken),
    };
    return header;
  }

  private userDetails: {
    id: string;
    name: string;
    seekerSignup: {
      email: string;
      adharNumber: string;
      adharCardImg: string;
      verified: boolean;
    };
    phonenumber: string;
    profileimage: string;
    qualification: string;
    language: string;
    dob: string;
    gender: string;
    permanentaddress: string;
    experience: string;
    aadhar_img: string;
  };

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
    verified: String;
  };

  charactersChanged = new Subject<void>();
  jobUpdate = new Subject<void>();
  jobDetailsUpdated = new Subject<void>();
  userDetailsUpdated = new Subject<void>();
  companyDetailsUpdated = new Subject<void>();

  notifcationCalled = false;

  appService: AppService;
  http: HttpClient;
  constructor(
    http: HttpClient,
    appService: AppService,
    private router: Router,
    public notifierService: NotifierService
  ) {
    this.appService = this.appService;
    this.http = http;
  }

  // User api url
  userUrl = environment.baseUrl;

  // Sign up user api
  addUser(user): Observable<any> {
    return this.http.post(this.userUrl + 'user/add', user);
  }

  // User login
  // userUrl="https://bluecollarbackend-dot-hu18-groupa-java.et.r.appspot.com/";
  loginUser(user): Observable<any> {
    return this.http.post(this.userUrl + 'user/login', user);
  }

  addUserDetails(userDetails): Observable<any> {
    return this.http.put(
      `${this.userUrl}` + 'seekerdetails/update',
      userDetails,
      this.getHeader()
    );
  }

  getUserDetails(): Observable<any> {
    return this.http.get(
      `${this.userUrl}` + `seekerdetails/get`,
      this.getHeader()
    );
  }

  onFilter(category, location): Observable<any> {
    return this.http.get(
      `${this.userUrl}` + `user/filter/` + `${category}/${location}`,
      this.getHeader()
    );
  }

  //fetch company details
  fetchCompanyDetails(jobId, companyName) {
    this.http
      .get(
        `${this.userUrl}` +
          `seeker/companydetails/` +
          jobId +
          `/` +
          companyName,
        this.getHeader()
      )
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
            verified: String;
          }) => {
            if (response == undefined) {
              console.log('empty');
            }
            this.companyDetails = response;
            return response;
          }
        )
      )
      .subscribe(
        (data) => {
          // console.log(data);
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

  fetchAllJobs() {
    this.http
      .get(`${this.userUrl}` + `seeker/alljob`, this.getHeader())
      .pipe(
        map(
          (responseData: {
            [key: string]: {
              jobId: string;
              title: string;
              description: string;
              experience: string;
              minSalary: string;
              maxSalary: string;
              lastDate: string;
              skills: string;
              location: string;
              applicant: string;
              companyName: string;
              createdate: string;
              category: string;
            };
          }) => {
            const dataArray: {
              jobId: string;
              title: string;
              description: string;
              experience: string;
              minSalary: string;
              maxSalary: string;
              lastDate: string;
              skills: string;
              location: string;
              applicant: string;
              companyName: string;
              createdate: string;
              category: string;
            }[] = [];
            for (const key in responseData) {
              if (responseData.hasOwnProperty(key)) {
                dataArray.push({ ...responseData[key] });
              }
            }

            const receivedJobs = [];
            for (let key in dataArray) {
              let value = dataArray[key];

              const uniqueJob = {
                jobId: value.jobId,
                title: value.title,
                description: value.description,
                experience: value.experience,
                minSalary: value.minSalary,
                maxSalary: value.maxSalary,
                lastDate: value.lastDate,
                skills: value.skills,
                location: value.location,
                applicant: value.applicant,
                companyName: value.companyName,
                createdate: value.createdate,
                category: value.category,
              };
              receivedJobs.push(uniqueJob);
            }
            return receivedJobs;
          }
        )
      )
      .subscribe(
        (data) => {
          data.sort((val1, val2) => {
            return (
              new Date(val2.createdate).getTime() -
              new Date(val1.createdate).getTime()
            );
          });
          this.allJobs = data;
          this.jobUpdate.next();
        },
        (error) => {
          localStorage.clear();
          // this.appService.login=false;
          // this.appService.role='';
          this.router.navigate(['/']);
        }
      );
  }

  fetchCompanyJobs(cid) {
    this.http
      .get(
        `${this.userUrl}` + `seeker/companyjob/` + `${cid}`,
        this.getHeader()
      )
      .pipe(
        map(
          (responseData: {
            [key: string]: {
              jobId: string;
              title: string;
              description: string;
              experience: string;
              minSalary: string;
              maxSalary: string;
              lastDate: string;
              skills: string;
              location: string;
              applicant: string;
              companyName: string;
              createdate: string;
              category: string;
            };
          }) => {
            const dataArray: {
              jobId: string;
              title: string;
              description: string;
              experience: string;
              minSalary: string;
              maxSalary: string;
              lastDate: string;
              skills: string;
              location: string;
              applicant: string;
              companyName: string;
              createdate: string;
              category: string;
            }[] = [];
            for (const key in responseData) {
              if (responseData.hasOwnProperty(key)) {
                dataArray.push({ ...responseData[key] });
              }
            }

            const receivedJobs = [];
            for (let key in dataArray) {
              let value = dataArray[key];

              const uniqueJob = {
                jobId: value.jobId,
                title: value.title,
                description: value.description,
                experience: value.experience,
                minSalary: value.minSalary,
                maxSalary: value.maxSalary,
                lastDate: value.lastDate,
                skills: value.skills,
                location: value.location,
                applicant: value.applicant,
                companyName: value.companyName,
                createdate: value.createdate,
                category: value.category,
              };
              receivedJobs.push(uniqueJob);
            }
            return receivedJobs;
          }
        )
      )
      .subscribe(
        (data) => {
          data.sort((val1, val2) => {
            return (
              new Date(val2.createdate).getTime() -
              new Date(val1.createdate).getTime()
            );
          });
          this.companyJobs = data;
          this.jobUpdate.next();
        },
        (error) => {
          localStorage.clear();
          // this.appService.login=false;
          // this.appService.role='';
          this.router.navigate(['/']);
        }
      );
  }

  getCompanyJobs() {
    return this.companyJobs;
  }

  fetchSavedJobs() {
    this.http
      .get(`${this.userUrl}` + `seeker/savedjob`, this.getHeader())
      .pipe(
        map(
          (responseData: {
            [key: string]: {
              jobId: string;
              title: string;
              description: string;
              experience: string;
              minSalary: string;
              maxSalary: string;
              lastDate: string;
              skills: string;
              location: string;
              applicant: string;
              companyName: string;
              createdate: string;
              category: string;
            };
          }) => {
            const dataArray: {
              jobId: string;
              title: string;
              description: string;
              experience: string;
              minSalary: string;
              maxSalary: string;
              lastDate: string;
              skills: string;
              location: string;
              applicant: string;
              companyName: string;
              createdate: string;
              category: string;
            }[] = [];
            for (const key in responseData) {
              if (responseData.hasOwnProperty(key)) {
                dataArray.push({ ...responseData[key] });
              }
            }

            const receivedJobs = [];
            for (let key in dataArray) {
              let value = dataArray[key]['jobPost'];

              const uniqueJob = {
                jobId: value.jobId,
                title: value.title,
                description: value.description,
                experience: value.experience,
                minSalary: value.minSalary,
                maxSalary: value.maxSalary,
                lastDate: value.lastDate,
                skills: value.skills,
                location: value.location,
                applicant: value.applicant,
                companyName: value.companyName,
                createdate: value.createdate,
                category: value.category,
              };

              receivedJobs.push(uniqueJob);
            }
            return receivedJobs;
          }
        )
      )
      .subscribe(
        (data) => {
          data.sort((val1, val2) => {
            return (
              new Date(val2.createdate).getTime() -
              new Date(val1.createdate).getTime()
            );
          });
          this.savedJobs = data;
          this.jobUpdate.next();
        },
        (error) => {
          localStorage.clear();
          // this.appService.login=false;
          // this.appService.role='';
          this.router.navigate(['/']);
        }
      );
  }

  fetchAppliedJobs() {
    this.http
      .get(`${this.userUrl}` + `seeker/appliedjob`, this.getHeader())
      .pipe(
        map(
          (responseData: {
            [key: string]: {
              applicationstatus: string;
              jobId: string;
              title: string;
              description: string;
              experience: string;
              minSalary: string;
              maxSalary: string;
              lastDate: string;
              skills: string;
              location: string;
              applicant: string;
              companyName: string;
              createdate: string;
              category: string;
            };
          }) => {
            const dataArray: {
              applicationstatus: string;
              jobId: string;
              title: string;
              description: string;
              experience: string;
              minSalary: string;
              maxSalary: string;
              lastDate: string;
              skills: string;
              location: string;
              applicant: string;
              companyName: string;
              createdate: string;
              category: string;
            }[] = [];
            for (const key in responseData) {
              if (responseData.hasOwnProperty(key)) {
                dataArray.push({ ...responseData[key] });
              }
            }
            const receivedJobs = [];
            for (let key in dataArray) {
              let value = dataArray[key]['jobPost'];
              let status = dataArray[key]['applicationstatus'];

              const uniqueJob = {
                applicationstatus: status,
                jobId: value.jobId,
                title: value.title,
                description: value.description,
                experience: value.experience,
                minSalary: value.minSalary,
                maxSalary: value.maxSalary,
                lastDate: value.lastDate,
                skills: value.skills,
                location: value.location,
                applicant: value.applicant,
                companyName: value.companyName,
                createdate: value.createdate,
                category: value.category,
              };

              receivedJobs.push(uniqueJob);
            }
            return receivedJobs;
          }
        )
      )
      .subscribe(
        (data) => {
          data.sort((val1, val2) => {
            return (
              new Date(val2.createdate).getTime() -
              new Date(val1.createdate).getTime()
            );
          });
          this.appliedJobs = data;
          this.jobUpdate.next();
        },
        (error) => {
          // console.log(error);
          localStorage.clear();
          this.router.navigate(['/']);
        }
      );
  }

  fetchUser() {
    this.http
      .get(`${this.userUrl}` + `seekerdetails/get`, this.getHeader())
      .pipe(
        map(
          (responseData: {
            id: string;
            name: string;
            seekerSignup: {
              email: string;
              adharNumber: string;
              adharCardImg: string;
              verified: boolean;
            };
            phonenumber: string;
            profileimage: string;
            qualification: string;
            language: string;
            dob: string;
            gender: string;
            permanentaddress: string;
            experience: string;
            aadhar_img: string;
          }) => {
            this.userDetails = responseData;
            return responseData;
          }
        )
      )
      .subscribe(
        (data) => {
          this.verified = data.seekerSignup.verified;
          this.apifetched = true;
          this.userDetails = data;
          this.userDetailsUpdated.next();

        },
        (error) => {
          localStorage.clear();
          this.router.navigate(['/']);
        }
      );
  }

  getUser() {
    return this.userDetails;
  }

  getAllJobs() {
    return this.allJobs.slice();
  }
  getSavedJobs() {
    return this.savedJobs.slice();
  }

  getAppliedJobs() {
    return this.appliedJobs.slice();
  }

  onMoveJobToSaved(job, status) {
    const jobStatus = {};
    jobStatus['job_id'] = parseInt(job.jobId);

    jobStatus['status'] = status;

    this.http
      .post(
        `${this.userUrl}` + `seeker/newJobStatus`,
        jobStatus,
        this.getHeader()
      )
      .subscribe(
        (response) => {
          swal.fire({
            title: 'Good job!',
            text: `Job ${status} Successfully`,
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
          this.moveJobToSaved(job, status);
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

  onRemoveJobFromSaved(job) {
    this.http
      .delete(
        `${this.userUrl}` + `seeker/remove/` + job.jobId,
        this.getHeader()
      )
      .subscribe(
        (response) => {
          this.removeFromSaved(job);
        },
        (error) => {
          // console.log('Some error occured');
        }
      );
  }

  moveJobToSaved(job, status) {
    if (status == 'Saved') this.savedJobs.push(job);
    else if (status == 'Applied') this.appliedJobs.push(job);

    this.jobUpdate.next();
    this.jobDetailsUpdated.next();
  }

  removeFromSaved(job) {
    let index = this.savedJobs.indexOf(job);

    if (index > -1) {
      this.savedJobs.splice(index, 1);
    }
    this.charactersChanged.next();
    this.jobUpdate.next();
    this.jobDetailsUpdated.next();
  }
}
