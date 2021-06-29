import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { CompanyService } from 'src/app/services/company/company/company.service';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userService: UserService;
  loggedOut: boolean;
  Uvalid: boolean = true;
  Cvalid: boolean = true;
  loadingComp: boolean = false;
  loadingUser: boolean = false;
  Uhide = true;
  Chide = true;

  companyLoginForm: FormGroup;
  userLoginForm: FormGroup;

  companyService: CompanyService;
  appService: AppService;

  Uerrormsg = '';
  Cerrormsg = '';

  constructor(
    private formBuilder: FormBuilder,
    companyService: CompanyService,
    private router: Router,
    userService: UserService,
    appService: AppService
  ) {
    this.userService = userService;
    this.companyService = companyService;
    this.appService = appService;
  }

  register() {}
  get company() {
    return this.companyLoginForm.controls;
  }
  get user() {
    return this.userLoginForm.controls;
  }

  ngOnInit(): void {
    this.companyLoginForm = this.formBuilder.group({
      companyEmail: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      companyPassword: [
        '',
        [Validators.required, Validators.minLength(8)]
      ],
    });
    this.userLoginForm = this.formBuilder.group({
      userEmail: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      userPassword: ['', [Validators.required, Validators.minLength(8)]],
    });

    let companyToken: string = localStorage['loginTokenID'];
    this.appService.role = localStorage['role'];

    if (companyToken != undefined) this.appService.login = true;

    if (this.appService.login == true && this.appService.role == 'company') {
      this.router.navigate(['/company/home']);
    }
    if (this.appService.login == true && this.appService.role == 'user') {
      this.router.navigate(['/user']);
    }

    if (this.appService.login == true && this.appService.role == 'user') {
      this.router.navigate(['/user']);
    }
  }
  // User Login
  onUserLogin() {
    //making btn disable/loading after clicking
    this.loadingUser = true;
    let loginBtn = document.getElementById('userLogin');
    loginBtn.innerHTML =
      '<i *ngIf="loading" class="fa fa-spinner fa-spin"></i> please wait...';

    let user = {
      email: this.userLoginForm.value.userEmail,
      password: this.userLoginForm.value.userPassword,
    };

    this.userService.loginUser(user).subscribe(
      (response) => {

        window.localStorage['loginTokenID'] = response['token'];
        window.localStorage['role'] = response['role'];

        this.router.navigate(['/user']);
      },
      (error) => {
        if (error.status == 500) {
          this.Uerrormsg = error.error.message.substring(20);
        }
        this.loadingUser = false;
        loginBtn.innerHTML = 'Login';
        this.Uvalid = false;
        setTimeout(() => {
          this.Uvalid = true;
        }, 5000);
      }
    );
  }

  onCompanyLogin() {
    //making btn disable/loading after clicking
    this.loadingComp = true;
    let loginBtn = document.getElementById('companyLogin');
    loginBtn.innerHTML =
      '<i *ngIf="loading" class="fa fa-spinner fa-spin"></i> please wait...';

    //Login
    let company = {
      email: this.companyLoginForm.value.companyEmail,
      password: this.companyLoginForm.value.companyPassword,
    };

    this.companyService.login(company).subscribe(
      (response) => {
        window.localStorage['loginTokenID'] = response['token'];
        window.localStorage['role'] = response['role'];

        this.appService.login = true;
        this.router.navigate(['/company/home']);
      },
      (error) => {
        this.loadingComp = false;
        loginBtn.innerHTML = 'Login';
        this.Cerrormsg = error.error.message;
        this.Cvalid = false;
        setTimeout(() => {
          this.Cvalid = true;
        }, 5000);
      }
    );
  }
}
