import { Component, OnInit } from '@angular/core';
import { UserForgetPasswordService } from 'src/app/services/user/user-forget-password/user-forget-password.service';

@Component({
  selector: 'app-user-forget-password',
  templateUrl: './user-forget-password.component.html',
  styleUrls: ['./user-forget-password.component.scss']
})
export class UserForgetPasswordComponent implements OnInit {
  forgetPasswordService: UserForgetPasswordService;
  constructor(forgetPasswordService: UserForgetPasswordService ) {
    this.forgetPasswordService = forgetPasswordService;
   }
  emailResponse: string;
  ngOnInit(): void {

  }

  onSendingEmail(){
    let email ={
      "email": this.emailResponse
    }
    this.forgetPasswordService.sendingEmailToResetPassword(email).subscribe(response => {
      alert("Check your email to reset password!");
    },
    (error) => {
      console.log(error);
      console.log("in error");

    })

  }

}
