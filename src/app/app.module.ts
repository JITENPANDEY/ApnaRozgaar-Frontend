import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HeaderComponent } from './components/header/header.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { UserLandingPageComponent } from './components/user-landing-page/user-landing-page.component';
import { CompanyLandingPageComponent } from './components/company-landing-page/company-landing-page.component';
import { JobPageComponent } from './components/job-page/job-page.component';
import { BannerComponent } from './components/banner/banner.component';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserService } from './services/user/user.service';
import { CompanyService } from './services/company/company/company.service';
import { InterceptorService } from './services/interceptor/interceptor.service';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ForgetPasswordComponent } from './components/password/company/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/password/company/reset-password/reset-password.component';
import { AddJobComponent } from './components/add-job/add-job.component';
import { CompanyProfileComponent } from './components/company-profile/company-profile.component';
import { UpdateJobComponent } from './components/update-job/update-job.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { UserForgetPasswordComponent } from './components/password/user/user-forget-password/user-forget-password.component';
import { UserResetPasswordComponent } from './components/password/user/user-reset-password/user-reset-password.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { SavedJobsComponent } from './components/saved-jobs/saved-jobs.component';
import { AppliedJobsComponent } from './components/applied-jobs/applied-jobs.component';
import { CompanyJobApplicantsComponent } from './components/company-job-applicants/company-job-applicants.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FooterComponent } from './components/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterUtilComponent } from './components/footer-util/footer-util.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatDividerModule} from '@angular/material/divider';
import { NotifierModule, NotifierOptions } from 'angular-notifier';

const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'left',
			distance: 12
		},
		vertical: {
			position: 'bottom',
			distance: 12,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};


export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LandingPageComponent,
    LoginComponent,
    SignUpComponent,
    UserLandingPageComponent,
    CompanyLandingPageComponent,
    JobPageComponent,
    BannerComponent,
    UserProfileComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    AddJobComponent,
    CompanyProfileComponent,
    UpdateJobComponent,
    SpinnerComponent,
    BreadcrumbComponent,
    UserForgetPasswordComponent,
    UserResetPasswordComponent,
    SavedJobsComponent,
    AppliedJobsComponent,
    CompanyJobApplicantsComponent,
    FooterComponent,
    FooterUtilComponent,
  ],
  imports: [
    NotifierModule.withConfig({
      // Custom options in here
      position: {

        horizontal: {

          /**
           * Defines the horizontal position on the screen
           * @type {'left' | 'middle' | 'right'}
           */
          position: 'right',

          /**
           * Defines the horizontal distance to the screen edge (in px)
           * @type {number}
           */
          distance: 12

        },

        vertical: {

          /**
           * Defines the vertical position on the screen
           * @type {'top' | 'bottom'}
           */
          position: 'top',

          /**
           * Defines the vertical distance to the screen edge (in px)
           * @type {number}
           */
          distance: 90,

          /**
           * Defines the vertical gap, existing between multiple notifications (in px)
           * @type {number}
           */
          gap: 10

        }

      },

    }),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    HttpClientModule,
    MatTooltipModule,
    SlickCarouselModule,
    FontAwesomeModule,
    MatRadioModule,
    MatDividerModule,
    NotifierModule.withConfig(customNotifierOptions),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [UserService, CompanyService,
    { provide:HTTP_INTERCEPTORS, useClass:InterceptorService, multi: true},
    // { provide:ErrorStateMatcher, useClass:ShowOnDirtyErrorStateMatcher}
  ],
  entryComponents: [AddJobComponent, CompanyProfileComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
