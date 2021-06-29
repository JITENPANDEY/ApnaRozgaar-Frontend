import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompanyService } from 'src/app/services/company/company/company.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit, OnDestroy {

  companyDetails: {
    moto: String,
    companyDetailId: number,
    companyName: String,
    email: String,
    description: String,
    photo: String,
    website: String,
    address: String,
    city: String,
    state: String,
    country: String,
    pinCode: String,
    verified: Boolean
  };

  verified: boolean = true;
  companyService: CompanyService;
  subscription: Subscription;
  constructor(companyService: CompanyService) {
    this.companyService = companyService;
  }

  ngOnInit(): void {
    this.companyDetails = {
      moto: "",
      companyDetailId: 0,
      companyName: "",
      email: "",
      description: "",
      photo: "",
      website: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
      verified: false,
    }
    this.companyService.fetchCompanyDetails();
    this.subscription = this.companyService.companyDetailsUpdated.subscribe(
      () => {
        
        
        this.companyDetails = this.companyService.getCompanyDetails();
      }
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
