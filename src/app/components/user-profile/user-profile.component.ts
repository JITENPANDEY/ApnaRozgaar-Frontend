import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import swal from 'sweetalert2';

import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app/app.service';
import { UserService } from 'src/app/services/user/user.service';

export interface Skills {
  skill: string;
}
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  appService: AppService;

  savedJobs = [];
  appliedJobs = [];

  login: boolean;

  myimage;
  myadhar;
  userDetails: {
    id: string;
    name: string;
    seekerSignup: { email: string; adharNumber: string, adharCardImg: string, verified: boolean};
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

  userDetailsForm: FormGroup;

  userService: UserService;

  subscription: Subscription;

  constructor(
    private router: Router,
    userService: UserService,
    appService: AppService
  ) {
    this.userService = userService;
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

    this.myimage =  '../../../assets/default_dp.jpg';
    this.myadhar = '../../../assets/default-adhar.jpg';

    this.userDetails = {
      id: '',
      name: '',
      seekerSignup: { email: '', adharNumber: '', adharCardImg: '', verified: false },
      phonenumber: '',
      profileimage: '',
      qualification: '',
      language: '',
      dob: '',
      gender: '',
      permanentaddress: '',
      experience: '',
      aadhar_img: ''
    };
    this.userDetailsForm = new FormGroup({
      dob: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      qualification: new FormControl('', Validators.required),
      permanentaddress: new FormControl('', Validators.required),
      profileimage: new FormControl(''),
      language: new FormControl('', Validators.required),
      experience: new FormControl('', Validators.required),
      aadhar_img: new FormControl('')
    });
    this.userService.fetchUser();
    this.subscription = this.userService.userDetailsUpdated.subscribe(() => {
      this.userDetails = this.userService.getUser();
      this.userDetailsForm.setValue({
        gender: this.userDetails.gender,
        dob: this.userDetails.dob,
        qualification: this.userDetails.qualification,
        permanentaddress: this.userDetails.permanentaddress,
        profileimage: this.userDetails.profileimage,
        language: this.userDetails.language,
        experience: this.userDetails.experience,
        aadhar_img: this.userDetails.seekerSignup.adharCardImg
      });

      if(this.userDetailsForm.value.profileimage  != null)
        this.myimage = this.userDetailsForm.value.profileimage;

      if(this.userDetailsForm.value.aadhar_img  != null)
        this.myadhar = this.userDetails.seekerSignup.adharCardImg;

    });
  }

  onUserLogout() {
    window.localStorage.clear();
    this.appService.login = false;
    this.appService.role = '';
    this.login = false;
    this.router.navigate(['/']);
  }

  onSaveUserDetails() {
    swal
      .fire({
        title: 'Do you want to save the changes?',
        showCancelButton: true,
        confirmButtonColor: '#4BB543',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Save',
      })
      .then((result) => {
        if (result.isConfirmed) {
          let userDetail = {
            qualification: this.userDetailsForm.value.qualification,
            language: this.userDetailsForm.value.language,
            gender: this.userDetailsForm.value.gender,
            dob: this.userDetailsForm.value.dob,
            permanentaddress: this.userDetailsForm.value.permanentaddress,
            experience: this.userDetailsForm.value.experience,
            profileimage: this.myimage,
            aadhar_img: this.myadhar
          };


          this.userService.addUserDetails(userDetail).subscribe((response) => {
            swal.fire({
              title: 'Profile Updated Successfully!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
            });
          });
        }

      });
  }

  // user profile picture

  onChange($event: Event,pic) {
    const file = ($event.target as HTMLInputElement).files[0];
    this.convertToBase64(file,pic);
  }

  convertToBase64(file: File,pic) {
    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file,subscriber);
    });
    observable.subscribe((d) => {
      if(pic == "pp")
        this.myimage = d;
      else if(pic == "adhar")
        this.myadhar = d;

      let userDetail = {
        profileimage: this.myimage,
        aadhar_img: this.myadhar
      };
      this.userService.addUserDetails(userDetail).subscribe((response) => {
      });


    });
  }

  readFile(file: File, subscriber: Subscriber<any>) {
    const filereader = new FileReader();
    filereader.readAsDataURL(file);

    filereader.onload = () => {
      subscriber.next(filereader.result);
      subscriber.complete();
    };

    filereader.onerror = (error) => {
      subscriber.error(error);
      subscriber.complete();
    };
  }

}
