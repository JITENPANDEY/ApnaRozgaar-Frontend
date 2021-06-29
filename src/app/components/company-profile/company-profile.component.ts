import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app/app.service';
import { CompanyService } from 'src/app/services/company/company/company.service';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert2';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss'],
})
export class CompanyProfileComponent implements OnInit {
  
  myimage;
  myadhar;
  gstNo: String = '';
  company: {
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
    adharNumber: String;
    adharCardImg: String;
    gstNo: String;
  };

  companyProfileForm: FormGroup;
  appService: AppService;
  spinnerService: SpinnerService;
  companyService: CompanyService;
  login: boolean;
  subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    companyService: CompanyService,
    appService: AppService,
    spinnerService: SpinnerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService
    
  ) {
    this.appService = appService;
    this.companyService = companyService;
    this.spinnerService = spinnerService;
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
    this.company= {
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
      adharCardImg:'',
      gstNo:''
    };
    this.companyService.fetchCompanyDetails();
    this.myimage = '../../../assets/default_dp.jpg';
    this.myadhar = '../../../assets/default-adhar.jpg';

    this.companyProfileForm = this.formBuilder.group({
      moto: [''],
      companyName: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      description: [''],
      website: [''],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      pinCode: ['', [Validators.required]],
    });

    
    this.subscription = this.companyService.companyDetailsUpdated.subscribe(
      () => {
        
        this.company = this.companyService.getCompanyDetails();
        this.companyProfileForm.patchValue({
          companyName: this.company.companyName,
          email: this.company.email,
          country: this.company.country,
          moto: this.company.moto,
          companyDetailId: this.company.companyDetailId,
          description: this.company.description,
          website: this.company.website,
          address: this.company.address,
          city: this.company.city,
          state: this.company.state,
          pinCode: this.company.pinCode,
        });

        
        if (this.company.gstNo != null) {
          this.gstNo = this.company.gstNo;
        }
        if (this.company.adharCardImg != null) {
          this.myadhar = this.company.adharCardImg;
        }
        if (this.company.photo != null) {
          this.myimage = this.company.photo;
        }
        
      }
    );
  }

  //check radio button
  radioChange(event){
    
    let aadhaar =<HTMLElement> document.querySelector(".aadhaar-section");
    let gst =<HTMLElement> document.querySelector(".gst");

   if(event.value == 1){
    aadhaar.style.display = "block";
    gst.style.display="none";
   }else{
    aadhaar.style.display = "none";
    gst.style.display="block";
    
   }
    

  }
  onSave() {
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
          (this.company.moto = this.companyProfileForm.value.moto),
            (this.company.companyDetailId =
              this.companyProfileForm.value.companyDetailId),
            (this.company.companyName =
              this.companyProfileForm.value.companyName),
            (this.company.email = this.companyProfileForm.value.email),
            (this.company.description =
              this.companyProfileForm.value.description),
            (this.company.website = this.companyProfileForm.value.website),
            (this.company.address = this.companyProfileForm.value.address),
            (this.company.city = this.companyProfileForm.value.city),
            (this.company.state = this.companyProfileForm.value.state),
            (this.company.country = this.companyProfileForm.value.country),
            (this.company.pinCode = this.companyProfileForm.value.pinCode);

          document.getElementsByTagName('img')[0].src = String(
            this.company.photo
          );
          this.company.gstNo = this.gstNo;         
          this.companyService.onUpdateCompanyDetail(this.company);
        }
      });
  }
  onCompanyLogout() {
    window.localStorage.clear();
    this.appService.login = false;
    this.appService.role = '';
    this.login = false;
    this.router.navigate(['/']);
  }

  //aadhaar upload
  onChange($event: Event, pic) {
    const file = ($event.target as HTMLInputElement).files[0];
    this.convertToBase64(file, pic);
  }

  convertToBase64(file: File, pic) {
    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    });
    observable.subscribe((d) => {
      if (pic == 'pp') {
        this.myimage = d;
        this.company.photo = d;
      } else if (pic == 'adhar') {
        this.myadhar = d;
        this.company.adharCardImg = d;
      }
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
