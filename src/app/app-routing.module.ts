import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddJobComponent } from './components/add-job/add-job.component';
import { AppliedJobsComponent } from './components/applied-jobs/applied-jobs.component';
import { CompanyLandingPageComponent } from './components/company-landing-page/company-landing-page.component';
import { CompanyProfileComponent } from './components/company-profile/company-profile.component';
import { JobPageComponent } from './components/job-page/job-page.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { ForgetPasswordComponent } from './components/password/company/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/password/company/reset-password/reset-password.component';
import { UserForgetPasswordComponent } from './components/password/user/user-forget-password/user-forget-password.component';
import { UserResetPasswordComponent } from './components/password/user/user-reset-password/user-reset-password.component';
import { SavedJobsComponent } from './components/saved-jobs/saved-jobs.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { UpdateJobComponent } from './components/update-job/update-job.component';
import { UserLandingPageComponent } from './components/user-landing-page/user-landing-page.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CompanyJobApplicantsComponent } from './components/company-job-applicants/company-job-applicants.component';

const routes: Routes = [
  { path: 'job/:id/:companyName', component: JobPageComponent },
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'user', component: UserLandingPageComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'job', component: JobPageComponent },
  { path: 'user/forgotpassword', component: UserForgetPasswordComponent },
  { path: 'user/resetPassword/:token', component: UserResetPasswordComponent },

  { path: 'company/forgotpassword', component: ForgetPasswordComponent },
  { path: 'company/home', component: CompanyLandingPageComponent },
  { path: 'company/resetPassword/:token', component: ResetPasswordComponent },
  { path: 'company/job/add', component: AddJobComponent },
  { path: 'company/profile', component: CompanyProfileComponent },
  { path: 'company/job/update/:id', component: UpdateJobComponent },
  { path: 'user/job/saved', component: SavedJobsComponent },
  { path: 'user/job/applied', component: AppliedJobsComponent },
  {
    path: 'company/job/applicants/:id',
    component: CompanyJobApplicantsComponent,
  },

  // { path: '**', redirectTo: '/'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
