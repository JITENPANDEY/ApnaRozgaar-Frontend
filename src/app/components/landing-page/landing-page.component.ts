import { Component, OnInit } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AppService } from 'src/app/services/app/app.service';
import { CompanyService } from 'src/app/services/company/company/company.service';
// import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  loggedOut: Boolean;
  role: String;
  appService: AppService;

  //founderDetails
  Founders = [
    {
      img: '../../../assets/suprabh.jpg',
      name: 'Suprabh Jain',
      role: 'Team Coach & CEO',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s,',
    },
    {
      img: '../../../assets/jiten.jpg',
      name: 'Jiten Pandey',
      role: 'Frontend Developer',
      description:
        'I am currently working as a Software Engineer at Hashedin By Deloitte. In this project I have engineered the frontend part using Angular. ',
    },
    {
      img: '../../../assets/saurav.jpg',
      name: 'Saurav Chaudhary',
      role: 'Frontend Developer',
      description:
        'I am currently working as a Software Engineer at Hashedin By Deloitte. In this project I have engineered the frontend part using Angular. ',
    },
    {
      img: '../../../assets/dhruv.png',
      name: 'Dhruv Bansal',
      role: 'Backend Developer',
      description:
        'I am currently working as a Software Engineer at Hashedin By Deloitte. In this project I have engineered the Backend part using Springboot and PostgreSQL.',
    },
    {
      img: '../../../assets/rishi.jpg',
      name: 'Rishikesh',
      role: 'Backend Developer',
      description:
        'I am currently working as a Software Engineer at Hashedin By Deloitte. In this project I have engineered the frontend part using Springboot and PostgreSQL. ',
    },
  ];

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    showArrow: false,
  };

  constructor(private router: Router, appService: AppService) {
    this.router = router;
    this.appService = appService;
  }

  ngOnInit(): void {
    let token = window.localStorage['loginTokenID'];
    this.role = window.localStorage['role'];

    if (token != undefined) {
      this.loggedOut = false;

      this.appService.login = true;

      if (this.role == 'user') {
        this.router.navigate(['/user']);
      } else if (this.role == 'company') {
        this.router.navigate(['/company/home']);
      }
    } else {
      this.appService.login = false;
      this.appService.role = '';
    }
  }
}
