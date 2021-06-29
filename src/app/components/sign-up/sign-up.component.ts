import { Component, OnInit } from '@angular/core';
import {
  EmailValidator,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { CompanyService } from 'src/app/services/company/company/company.service';
import { UserService } from 'src/app/services/user/user.service';
import { ConfirmPasswordValidator } from './confirm-password-validatior';
import swal from 'sweetalert2';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  userService: UserService;
  companyService: CompanyService;

  companySignUpForm: FormGroup;
  userSignUpForm: FormGroup;
  submitted = false;
  loadingComp = false;
  loadingUser = false;
  signUpResponse;

  //error message
  Cerrormsg = '';
  Uerrormsg = '';
  Uvalid: boolean = true;
  Cvalid: boolean = true;
  CIsSuccess: boolean = false;
  UIsSuccess: boolean = false;

  //show password icon
  userPassHide = true;
  userConfPassHide = true;
  companyPassHide = true;
  companyConfPassHide = true;

  constructor(
    private formBuilder: FormBuilder,
    userService: UserService,
    public loaderService: LoaderService,
    companyService: CompanyService,
    private router: Router
  ) {
    this.userService = userService;
    this.companyService = companyService;
  }

  get company() {
    return this.companySignUpForm.controls;
  }
  get user() {
    return this.userSignUpForm.controls;
  }

  ngOnInit(): void {
    this.companySignUpForm = this.formBuilder.group(
      {
        companyName: ['', Validators.required],
        companyEmail: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
        country: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: ConfirmPasswordValidator('password', 'confirmPassword'),
      }
    );

    this.userSignUpForm = this.formBuilder.group(
      {
        userName: ['', Validators.required],
        userEmail: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
        phone: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
          ],
        ],
        adharNumber: [
          '',
          [
            Validators.required,
            Validators.minLength(12),
            Validators.maxLength(12),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: ConfirmPasswordValidator('password', 'confirmPassword'),
      }
    );
  }

  onCompanyRegister() {
    this.loadingComp = true;
    let signUpBtn = document.getElementById('companySignup');
    signUpBtn.innerHTML =
      '<i *ngIf="loading" class="fa fa-spinner fa-spin"></i> please wait...';
    let company = {
      companyName: this.companySignUpForm.value.companyName,
      email: this.companySignUpForm.value.companyEmail,
      country: this.companySignUpForm.value.country,
      password: this.companySignUpForm.value.password,
    };
    this.companyService.addCompany(company).subscribe(
      (response) => {
        this.CIsSuccess = true;
        this.signUpResponse = response.message;
        this.loadingComp = false;
        setTimeout(() => {
          this.CIsSuccess = false;
        }, 5000);
        signUpBtn.textContent = 'Sign up';
      },
      (error) => {
        this.loadingComp = false;
        signUpBtn.innerHTML = 'Sign up';
        this.Cerrormsg = error.error.message;
        this.Cvalid = false;
        setTimeout(() => {
          this.Cvalid = true;
        }, 5000);
      }
    );
    this.companySignUpForm.reset();
  }

  // correct
  onUserRegister() {
    this.loadingUser = true;
    let signUpBtn = document.getElementById('userSignup');
    signUpBtn.innerHTML =
      '<i *ngIf="loading" class="fa fa-spinner fa-spin"></i> please wait...';
    let user = {
      name: this.userSignUpForm.value.userName,
      email: this.userSignUpForm.value.userEmail,
      phonenumber: this.userSignUpForm.value.phone,
      adharNumber: this.userSignUpForm.value.adharNumber,
      password: this.userSignUpForm.value.password,
    };

    this.userService.addUser(user).subscribe(
      (response) => {
        this.UIsSuccess = true;
        this.signUpResponse = response.message;
        this.loadingUser = false;
        setTimeout(() => {
          this.UIsSuccess = false;
        }, 5000);
        signUpBtn.textContent = 'Sign up';
      },
      (error) => {
        this.loadingUser = false;
        signUpBtn.innerHTML = 'Sign up';
        this.Uerrormsg = error.error.message;
        this.Uvalid = false;
        setTimeout(() => {
          this.Uvalid = true;
        }, 5000);
      }
    );
    this.userSignUpForm.reset();
  }
}
